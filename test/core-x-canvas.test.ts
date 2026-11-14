import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createEChartsCanvasHost,
  createPlatformCanvas,
  enableEChartsDirtyRectPainter,
  getNativeCanvasDataURL,
  installEChartsPlatformAPI,
  releaseEChartsPlatformContext,
  resolveCanvasPixelRatio,
  shouldRecreateForPixelRatio
} from "../packages/core-x/src/adapters/canvas";

function setDocument(value: any) {
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    writable: true,
    value
  });
}

afterEach(() => {
  delete (globalThis as any).document;
  vi.restoreAllMocks();
});

describe("core-x canvas adapter", () => {
  it("resolves a measured pixel ratio before the device fallback", () => {
    expect(resolveCanvasPixelRatio(825, 300, 1)).toBe(2.75);
    expect(resolveCanvasPixelRatio(550, 200, 1)).toBe(2.75);
    expect(resolveCanvasPixelRatio(825.1234, 300, 1)).toBe(2.75);
    expect(resolveCanvasPixelRatio(0, 300, 2.75)).toBe(2.75);
    expect(resolveCanvasPixelRatio(2700, 300, 2)).toBe(2);
    expect(resolveCanvasPixelRatio(300, 300, 0.5)).toBe(1);
  });

  it("recreates only for a meaningful pixel-ratio change", () => {
    expect(shouldRecreateForPixelRatio(2.75, 2.75)).toBe(false);
    expect(shouldRecreateForPixelRatio(2.75, 2.7501)).toBe(false);
    expect(shouldRecreateForPixelRatio(2.75, 2)).toBe(true);
    expect(shouldRecreateForPixelRatio(0, 2)).toBe(false);
    expect(shouldRecreateForPixelRatio(2, Number.NaN)).toBe(false);
  });

  it("keeps logical and native canvas sizes in sync", () => {
    const context = {
      measureText: vi.fn()
    } as unknown as CanvasRenderingContext2D;
    const nativeCanvas = {
      width: 300,
      height: 200,
      toDataURL: vi.fn(() => "data:image/png;base64,native")
    };
    const host = createEChartsCanvasHost(
      context,
      nativeCanvas,
      300,
      200,
      2
    );

    expect(host.width).toBe(600);
    expect(host.height).toBe(400);
    expect(host.clientWidth).toBe(300);
    expect(host.clientHeight).toBe(200);
    expect(host.getContext("2d")).toBe(context);
    expect(host.getContext("webgl")).toBeNull();

    host.width = 800;
    host.height = 480;

    expect(nativeCanvas.width).toBe(800);
    expect(nativeCanvas.height).toBe(480);
    expect(host.clientWidth).toBe(400);
    expect(host.clientHeight).toBe(240);

    host.setAttribute("data-zr-dom-id", "layer-1");
    expect(host.getAttribute("data-zr-dom-id")).toBe("layer-1");
    expect(host.getAttribute("missing")).toBeNull();
    expect(host.toDataURL?.("image/png", 0.8)).toBe("data:image/png;base64,native");
    expect(nativeCanvas.toDataURL).toHaveBeenCalledWith("image/png", 0.8);
  });

  it("exports the current native canvas without creating another chart host", () => {
    const toDataURL = vi.fn(() => "data:image/png;base64,exported");
    const canvas = {
      width: 300,
      height: 200,
      toDataURL
    };

    expect(getNativeCanvasDataURL(canvas, {
      type: "jpeg",
      quality: 0.7
    })).toBe("data:image/png;base64,exported");
    expect(toDataURL).toHaveBeenCalledWith("image/jpeg", 0.7);
    expect(getNativeCanvasDataURL(null)).toBe("");
    expect(getNativeCanvasDataURL({
      width: 300,
      height: 200
    })).toBe("");
  });

  it("patches dirty-rect painting without the native outer clip", () => {
    const context = {
      restore: vi.fn(),
      save: vi.fn()
    };
    const paintInRect = vi.fn((_layer: any, cursor: any) => {
      cursor.drawIdx = cursor.endIdx;
    });
    const painter = {
      _opts: {
        useDirtyRect: false
      },
      _paintPerCursor: vi.fn(),
      _paintPerCursorInRect: paintInRect
    };
    const layer = {
      ctx: context
    };
    const cursor = {
      drawIdx: 0,
      endIdx: 2
    };
    const repaintRects = [{ x: 0, y: 0, width: 20, height: 20 }];

    expect(enableEChartsDirtyRectPainter(painter)).toBe(true);
    expect(painter._opts.useDirtyRect).toBe(true);
    expect(painter._paintPerCursor(layer, cursor, [], repaintRects, true)).toBe(true);
    expect(paintInRect).toHaveBeenCalledWith(layer, cursor, [], repaintRects[0], true);
    expect(context.save).toHaveBeenCalledOnce();
    expect(context.restore).toHaveBeenCalledOnce();
  });

  it("paints merged dirty rects in one pass", () => {
    const context = {
      restore: vi.fn(),
      save: vi.fn()
    };
    const paintInRect = vi.fn((_layer: any, cursor: any) => {
      cursor.drawIdx = cursor.endIdx;
    });
    const painter = {
      _opts: {
        useDirtyRect: false
      },
      _paintPerCursor: vi.fn(),
      _paintPerCursorInRect: paintInRect
    };
    const layer = {
      ctx: context
    };
    const cursor = {
      drawIdx: 0,
      endIdx: 4
    };
    const repaintRects = [
      { x: 0, y: 0, width: 20, height: 20 },
      { x: 40, y: 40, width: 10, height: 10 }
    ];

    expect(enableEChartsDirtyRectPainter(painter)).toBe(true);
    expect(painter._paintPerCursor(layer, cursor, [], repaintRects, false)).toBe(true);
    expect(paintInRect).toHaveBeenCalledOnce();
    expect(paintInRect).toHaveBeenCalledWith(layer, cursor, [], {
      x: 0,
      y: 0,
      width: 50,
      height: 50
    }, false);
    expect(cursor.drawIdx).toBe(4);
    expect(context.save).toHaveBeenCalledOnce();
    expect(context.restore).toHaveBeenCalledOnce();
  });

  it("expands the paint rect around elements that cross its boundary", () => {
    const context = {
      restore: vi.fn(),
      save: vi.fn()
    };
    const paintInRect = vi.fn((_layer: any, cursor: any) => {
      cursor.drawIdx = cursor.endIdx;
    });
    const painter = {
      _opts: {
        useDirtyRect: false
      },
      _paintPerCursor: vi.fn(),
      _paintPerCursorInRect: paintInRect
    };
    const layer = {
      ctx: context
    };
    const cursor = {
      drawIdx: 0,
      endIdx: 3
    };
    const repaintRects = [{ x: 10, y: 10, width: 20, height: 20 }];
    const intersects = (a: any, b: any) => (
      a.x < b.x + b.width
      && b.x < a.x + a.width
      && a.y < b.y + b.height
      && b.y < a.y + a.height
    );
    const element = (x: number, y: number, width: number, height: number) => ({
      getPaintRect: () => ({
        x,
        y,
        width,
        height,
        intersect: (rect: any) => intersects({ x, y, width, height }, rect)
      })
    });
    const list = [
      element(15, 15, 40, 40),
      element(50, 50, 30, 30),
      element(200, 200, 10, 10)
    ];

    expect(enableEChartsDirtyRectPainter(painter)).toBe(true);
    expect(painter._paintPerCursor(layer, cursor, list, repaintRects, false)).toBe(true);
    expect(paintInRect).toHaveBeenCalledWith(layer, cursor, list, {
      x: 10,
      y: 10,
      width: 70,
      height: 70
    }, false);
  });

  it("leaves dirty rects disabled when the painter is incompatible", () => {
    const painter = {
      _opts: {
        useDirtyRect: false
      }
    };

    expect(enableEChartsDirtyRectPainter(painter)).toBe(false);
    expect(painter._opts.useDirtyRect).toBe(false);
    expect(enableEChartsDirtyRectPainter(null)).toBe(false);
  });

  it("creates independent browser canvases for ECharts platform use", () => {
    expect(createPlatformCanvas()).toBeNull();

    const createElement = vi.fn(() => ({
      getContext: vi.fn()
    }));
    setDocument({ createElement });

    const first = createPlatformCanvas();
    const second = createPlatformCanvas();

    expect(createElement).toHaveBeenCalledTimes(2);
    expect(createElement).toHaveBeenCalledWith("canvas");
    expect(first).not.toBe(second);
  });

  it("installs global text measurement without leaking a chart host", () => {
    const context = {
      font: "",
      measureText: vi.fn((text: string) => ({ width: text.length * 6 })),
      restore: vi.fn(),
      save: vi.fn()
    } as unknown as CanvasRenderingContext2D;
    let platformAPI: Record<string, any> = {};
    const echarts = {
      setPlatformAPI(value: Record<string, any>) {
        platformAPI = value;
      }
    };

    installEChartsPlatformAPI(echarts as any, context);

    expect(() => platformAPI.createCanvas()).toThrow(/requires a browser document/);
    expect(platformAPI.measureText("chart", "12px sans-serif")).toEqual({ width: 30 });
    expect(context.save).toHaveBeenCalledOnce();
    expect(context.restore).toHaveBeenCalledOnce();

    releaseEChartsPlatformContext(context);

    expect(platformAPI.measureText("fallback")).toEqual({
      width: expect.any(Number)
    });
  });

  it("keeps text measurement on a live context across instance disposal", () => {
    const first = {
      font: "",
      measureText: vi.fn((text: string) => ({ width: text.length * 4 })),
      restore: vi.fn(),
      save: vi.fn()
    } as unknown as CanvasRenderingContext2D;
    const second = {
      font: "",
      measureText: vi.fn((text: string) => ({ width: text.length * 8 })),
      restore: vi.fn(),
      save: vi.fn()
    } as unknown as CanvasRenderingContext2D;
    let platformAPI: Record<string, any> = {};
    const echarts = {
      setPlatformAPI(value: Record<string, any>) {
        platformAPI = value;
      }
    };

    installEChartsPlatformAPI(echarts as any, first);
    installEChartsPlatformAPI(echarts as any, second);

    expect(platformAPI.measureText("chart").width).toBe(20);

    releaseEChartsPlatformContext(second);

    expect(platformAPI.measureText("chart").width).toBe(20);
    expect(first.measureText).toHaveBeenCalled();

    releaseEChartsPlatformContext(first);

    expect(platformAPI.measureText("chart")).toEqual({
      width: expect.any(Number)
    });
  });
});
