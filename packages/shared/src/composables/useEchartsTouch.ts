import type { MaybeRefOrGetter, Reactive, Ref } from "vue";
import { shallowRef, toValue } from "vue";
import type { EChartsType, NullableValue } from "../types";
import { querySelect, UniCanvas } from "../utils";
import type { VueThis } from "./useVueThis";

export interface CanvasRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface NormalizedTouch {
  x: number;
  y: number;
  wheelDelta: number;
}

export interface GetTouchFuc {
  (event: TouchEvent, touches: Touch[]): NormalizedTouch;

  (event: MouseEvent): NormalizedTouch;

  (event: TouchEvent | MouseEvent, touches?: Touch[]): NormalizedTouch;
}

export function useEchartsTouch({
  vueThis,
  supportHover,
  isPc,
  canvasId,
  chart,
  canvasRect,
  getTouch
}: {
  vueThis: VueThis;
  supportHover: MaybeRefOrGetter<boolean>;
  isPc: boolean;
  canvasId: string;
  chart: Ref<NullableValue<EChartsType>>;
  canvasRect: Reactive<CanvasRect>;
  getTouch: GetTouchFuc;
}): {
  onStart: (event: TouchEvent) => void;
  onMove: (event: TouchEvent) => void;
  onEnd: (event: TouchEvent) => void;
  cleanup: () => void;
} {
  const touching = shallowRef(false);

  const state = {
    x: 0,
    y: 0,
    t: 0
  };

  let timer = 0;

  let ticking = false;
  let rafId = 0;
  let lastMoveEvent: NullableValue<TouchEvent> = null;

  function destroyTimer() {
    if (timer === 0) {
      return;
    }

    clearTimeout(timer);
    timer = 0;
  }

  function getCanvas(): NullableValue<UniCanvas> {
    if (chart.value == null) {
      return null;
    }

    return chart.value.getDom() as unknown as UniCanvas;
  }

  function normalizeTouches(touches: TouchList) {
    if (Array.isArray(touches)) {
      return touches as Touch[];
    }

    if (typeof touches === "object" && touches != null) {
      return Object.values(touches);
    }

    return touches;
  }

  function transformTouchesEvent(event: TouchEvent): any { // any -> ZRRawEvent
    // event.touches is a TouchList, which isn't iterable, so can't use for...of
    for (let i = 0; i < event.touches.length; i += 1) {
      const item = event.touches[i];

      // @ts-expect-error whatever
      item.offsetX = item.x;
      // @ts-expect-error whatever
      item.offsetY = item.y;
    }

    return event;
  }

  function onStart(event: TouchEvent) {
    touching.value = true;

    const next = () => {
      if (chart.value == null) {
        return;
      }

      const touch = getTouch(event, normalizeTouches(event.touches));

      state.x = touch.x;
      state.y = touch.y;
      state.t = Date.now();

      const { handler } = chart.value.getZr();
      UniCanvas.dispatch(handler, "mousedown", touch);
      UniCanvas.dispatch(handler, "mousemove", touch);
      handler.processGesture(transformTouchesEvent(event), "start");

      destroyTimer();
    };

    querySelect(vueThis, `#${canvasId}`, {
      rect: true
    }).then(({ top, left }) => {
      canvasRect.top = top!;
      canvasRect.left = left!;
    }).finally(() => {
      next();
    });
  }

  function _onMove(event: TouchEvent) {
    if (isPc && toValue(supportHover) && !touching.value) {
      touching.value = true;
    }

    if (chart.value == null || !touching.value) {
      return;
    }

    const { handler } = chart.value.getZr();
    UniCanvas.dispatch(handler, "mousemove", getTouch(event, normalizeTouches(event.touches)));
    handler.processGesture(transformTouchesEvent(event), "change");
  }

  function onMove(event: TouchEvent) {
    const canvas = getCanvas();

    if (canvas == null) {
      return;
    }

    lastMoveEvent = event;

    if (ticking) {
      return;
    }

    ticking = true;

    rafId = canvas.requestAnimationFrame(() => {
      try {
        if (lastMoveEvent != null) {
          _onMove(lastMoveEvent);
        }
      } finally {
        lastMoveEvent = null;
        ticking = false;
      }
    });
  }

  function onEnd(event: TouchEvent) {
    touching.value = false;

    if (chart.value == null) {
      return;
    }

    const touch = getTouch(event, normalizeTouches(event.changedTouches));

    const { handler } = chart.value.getZr();
    UniCanvas.dispatch(handler, "mouseup", touch);
    handler.processGesture(transformTouchesEvent(event), "end");

    const isClick = (Math.abs(touch.x - state.x) < 10)
      && (Date.now() - state.t < 200);

    if (isClick) {
      UniCanvas.dispatch(handler, "click", touch);
    } else {
      if (timer > 0) {
        destroyTimer();
      }

      timer = setTimeout(() => {
        UniCanvas.dispatch(handler, "mousemove", { x: 999999999, y: 999999999 });
        UniCanvas.dispatch(handler, "mouseup", { x: 999999999, y: 999999999 });
      }, 50);
    }
  }

  function cleanup() {
    destroyTimer();

    if (rafId !== 0) {
      const canvas = getCanvas();

      if (canvas != null) {
        canvas.cancelAnimationFrame(rafId);
      }

      rafId = 0;
    }

    lastMoveEvent = null;
    ticking = false;
  }

  return {
    onStart,
    onMove,
    onEnd,
    cleanup
  };
}