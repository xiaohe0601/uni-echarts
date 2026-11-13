export interface CanvasRectLike {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface TouchPointLike {
  clientX?: number;
  clientY?: number;
  pageX?: number;
  pageY?: number;
  x?: number;
  y?: number;
}

export interface TouchEventLike {
  touches?: TouchPointLike[];
  changedTouches?: TouchPointLike[];
}

export interface NormalizedTouch {
  x: number;
  y: number;
}

export interface ZRenderPointerHandler {
  dispatch: (event: string, payload: Record<string, any>) => void;
}

export interface TouchBridgeOptions {
  getHandler: () => ZRenderPointerHandler | null;
  getRect: () => CanvasRectLike;
  onPoint?: (type: string, point: NormalizedTouch) => void;
}

export interface TouchBridge {
  onStart: (event: TouchEventLike) => void;
  onMove: (event: TouchEventLike) => void;
  onEnd: (event: TouchEventLike) => void;
  onCancel: (event: TouchEventLike) => void;
  cleanup: () => void;
}

const CLICK_MOVE_THRESHOLD = 10;

function firstTouch(list?: TouchPointLike[]): TouchPointLike | null {
  if (list == null || list.length === 0) {
    return null;
  }

  return list[0];
}

function hasNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function normalizeTouchPoint(
  touch: TouchPointLike | null,
  rect: CanvasRectLike
): NormalizedTouch | null {
  if (touch == null) {
    return null;
  }

  if (hasNumber(touch.clientX) && hasNumber(touch.clientY)) {
    return {
      x: Math.max(0, touch.clientX - rect.left),
      y: Math.max(0, touch.clientY - rect.top)
    };
  }

  if (hasNumber(touch.pageX) && hasNumber(touch.pageY)) {
    return {
      x: Math.max(0, touch.pageX - rect.left),
      y: Math.max(0, touch.pageY - rect.top)
    };
  }

  if (hasNumber(touch.x) && hasNumber(touch.y)) {
    return {
      x: touch.x,
      y: touch.y
    };
  }

  return null;
}

export function dispatchPointer(
  handler: ZRenderPointerHandler,
  type: string,
  point: NormalizedTouch,
  wheelDelta = 0
): void {
  handler.dispatch(type, {
    zrX: point.x,
    zrY: point.y,
    zrDelta: wheelDelta,
    preventDefault() {},
    stopImmediatePropagation() {},
    stopPropagation() {}
  });
}

export function createTouchBridge(options: TouchBridgeOptions): TouchBridge {
  const start = {
    x: 0,
    y: 0,
    active: false
  };

  function dispatch(type: string, event: TouchEventLike, useChangedTouches = false) {
    const handler = options.getHandler();
    const touch = firstTouch(useChangedTouches ? event.changedTouches : event.touches);
    const point = normalizeTouchPoint(touch, options.getRect());

    if (handler == null || point == null) {
      return null;
    }

    dispatchPointer(handler, type, point);
    options.onPoint?.(type, point);

    return point;
  }

  function onStart(event: TouchEventLike) {
    const handler = options.getHandler();
    const touch = firstTouch(event.touches);
    const point = normalizeTouchPoint(touch, options.getRect());

    if (handler == null || point == null) {
      return;
    }

    start.x = point.x;
    start.y = point.y;
    start.active = true;

    dispatchPointer(handler, "mousedown", point);
    dispatchPointer(handler, "mousemove", point);
    options.onPoint?.("mousedown", point);
  }

  function onMove(event: TouchEventLike) {
    if (!start.active) {
      return;
    }

    dispatch("mousemove", event);
  }

  function onEnd(event: TouchEventLike) {
    if (!start.active) {
      return;
    }

    start.active = false;
    const point = dispatch("mouseup", event, true);

    if (point == null) {
      return;
    }

    const moved = Math.abs(point.x - start.x) > CLICK_MOVE_THRESHOLD
      || Math.abs(point.y - start.y) > CLICK_MOVE_THRESHOLD;
    const handler = options.getHandler();

    if (handler != null && !moved) {
      dispatchPointer(handler, "click", point);
      options.onPoint?.("click", point);
    }
  }

  function onCancel(event: TouchEventLike) {
    if (!start.active) {
      return;
    }

    start.active = false;
    dispatch("mouseup", event, true);
  }

  function cleanup() {
    start.active = false;
  }

  return {
    onStart,
    onMove,
    onEnd,
    onCancel,
    cleanup
  };
}