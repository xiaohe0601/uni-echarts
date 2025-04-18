import { shallowRef, toValue } from "vue";
import { UniCanvas } from "../utils/canvas";
import { querySelect } from "../utils/uni";

export function useEchartsTouch({
  vueThis,
  supportHover,
  isPc,
  canvasId,
  chart,
  canvasRect,
  getTouch
}) {
  const touching = shallowRef(false);

  const state = {
    x: 0,
    y: 0,
    t: 0
  };

  let timer = 0;

  function destroyTimer() {
    if (timer === 0) {
      return;
    }

    clearTimeout(timer);
    timer = 0;
  }

  function normalizeTouches(touches) {
    if (Array.isArray(touches)) {
      return touches;
    }

    if (typeof touches === "object" && touches != null) {
      return Object.values(touches);
    }

    return touches;
  }

  function transformTouchesEvent(event) {
    // event.touches is a TouchList, which isn't iterable, so can't use for...of
    for (let i = 0; i < event.touches.length; i += 1) {
      const item = event.touches[i];

      item.offsetX = item.x;
      item.offsetY = item.y;
    }

    return event;
  }

  function onStart(event) {
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

    if (isPc) {
      querySelect(vueThis, `#${canvasId}`, {
        rect: true
      }).then(({ top, left }) => {
        canvasRect.top = top;
        canvasRect.left = left;

        next();
      });
      return;
    }

    next();
  }

  function onMove(event) {
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

  function onEnd(event) {
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

  return {
    onStart,
    onMove,
    onEnd
  };
}