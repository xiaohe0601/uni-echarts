import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createTouchBridge,
  dispatchPointer,
  normalizeTouchPoint
} from "../packages/core-x/src/adapters/touch";

const rect = {
  left: 10,
  top: 20,
  width: 100,
  height: 80
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("core-x touch adapter", () => {
  it("normalizes client, page and local coordinates", () => {
    expect(normalizeTouchPoint({ clientX: 30, clientY: 50 }, rect)).toEqual({
      x: 20,
      y: 30
    });
    expect(normalizeTouchPoint({ pageX: 40, pageY: 70 }, rect)).toEqual({
      x: 30,
      y: 50
    });
    expect(normalizeTouchPoint({ x: 12, y: 14 }, rect)).toEqual({
      x: 12,
      y: 14
    });
    expect(normalizeTouchPoint({ clientX: 1, clientY: 1 }, rect)).toEqual({
      x: 0,
      y: 0
    });
    expect(normalizeTouchPoint({}, rect)).toBeNull();
  });

  it("dispatches zrender pointer payloads", () => {
    const handler = {
      dispatch: vi.fn()
    };

    dispatchPointer(handler, "mousemove", { x: 24, y: 36 }, 4);

    expect(handler.dispatch).toHaveBeenCalledWith("mousemove", expect.objectContaining({
      zrX: 24,
      zrY: 36,
      zrDelta: 4
    }));
  });

  it("maps a short tap to mousedown, mousemove, mouseup and click", () => {
    const handler = {
      dispatch: vi.fn()
    };
    const bridge = createTouchBridge({
      getHandler: () => handler,
      getRect: () => rect
    });

    bridge.onStart({
      touches: [{ clientX: 30, clientY: 50 }]
    });
    bridge.onEnd({
      changedTouches: [{ clientX: 32, clientY: 52 }]
    });

    expect(handler.dispatch.mock.calls.map(([type]) => type)).toEqual([
      "mousedown",
      "mousemove",
      "mouseup",
      "click"
    ]);
    expect(handler.dispatch).toHaveBeenLastCalledWith("click", expect.objectContaining({
      zrX: 22,
      zrY: 32
    }));
  });

  it("does not synthesize a click after a drag", () => {
    const handler = {
      dispatch: vi.fn()
    };
    const bridge = createTouchBridge({
      getHandler: () => handler,
      getRect: () => rect
    });

    bridge.onStart({
      touches: [{ clientX: 30, clientY: 50 }]
    });
    bridge.onEnd({
      changedTouches: [{ clientX: 42, clientY: 50 }]
    });

    expect(handler.dispatch.mock.calls.map(([type]) => type)).not.toContain("click");
  });

  it("cleans up an active gesture and tolerates a missing handler", () => {
    const handler = {
      dispatch: vi.fn()
    };
    let current = handler as typeof handler | null;
    const bridge = createTouchBridge({
      getHandler: () => current,
      getRect: () => rect
    });

    bridge.onStart({
      touches: [{ clientX: 30, clientY: 50 }]
    });
    bridge.cleanup();
    current = null;
    bridge.onMove({
      touches: [{ clientX: 40, clientY: 60 }]
    });
    bridge.onEnd({
      changedTouches: [{ clientX: 30, clientY: 50 }]
    });

    expect(handler.dispatch).toHaveBeenCalledTimes(2);
  });
});