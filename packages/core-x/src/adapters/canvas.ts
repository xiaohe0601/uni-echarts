import type * as ECharts from "echarts/core";

export type DrawableCanvasContext = CanvasRenderingContext2D & {
  draw?: () => void;
};

export interface NativeCanvasLike {
  width: number;
  height: number;
  toDataURL?: (type?: string, quality?: any) => string;
}

export interface EChartsCanvasHost {
  width: number;
  height: number;
  readonly clientWidth: number;
  readonly clientHeight: number;
  getContext: (type: string) => CanvasRenderingContext2D | null;
  setAttribute: (name: string, value: string) => void;
  getAttribute: (name: string) => string | null;
  addEventListener: (type: string, listener: unknown) => void;
  removeEventListener: (type: string, listener: unknown) => void;
  toDataURL?: (type?: string, quality?: any) => string;
}

export interface CanvasPainterLike {
  _opts?: {
    useDirtyRect?: boolean;
  };
  _paintPerCursor?: (...args: any[]) => boolean;
  _paintPerCursorInRect?: (...args: any[]) => void;
}

const measureContexts: CanvasRenderingContext2D[] = [];

function normalizeDataURLType(options?: Record<string, any>): string {
  const type = typeof options?.type === "string" ? options.type : "png";

  return type.startsWith("image/") ? type : `image/${type}`;
}

export function resolveCanvasPixelRatio(
  canvasWidth: number,
  layoutWidth: number,
  fallback: number
): number {
  if (canvasWidth > 0 && layoutWidth > 0) {
    const ratio = canvasWidth / layoutWidth;

    if (Number.isFinite(ratio) && ratio >= 0.5 && ratio <= 8) {
      return Math.round(ratio * 1000) / 1000;
    }
  }

  return Number.isFinite(fallback) && fallback >= 1 ? fallback : 1;
}

export function shouldRecreateForPixelRatio(
  current: number,
  next: number
): boolean {
  return Number.isFinite(current)
    && Number.isFinite(next)
    && current > 0
    && next > 0
    && Math.abs(current - next) > 0.01;
}

export function createEChartsCanvasHost(
  context: CanvasRenderingContext2D,
  nativeCanvas: NativeCanvasLike,
  logicalWidth: number,
  logicalHeight: number,
  dpr: number
): EChartsCanvasHost {
  let pixelWidth = logicalWidth * dpr;
  let pixelHeight = logicalHeight * dpr;
  let layoutWidth = logicalWidth;
  let layoutHeight = logicalHeight;
  const attributes = new Map<string, string>();

  return {
    get width() {
      return pixelWidth;
    },
    set width(value: number) {
      pixelWidth = value;
      layoutWidth = dpr > 0 ? value / dpr : value;
      if (nativeCanvas.width !== value) {
        nativeCanvas.width = value;
      }
    },
    get height() {
      return pixelHeight;
    },
    set height(value: number) {
      pixelHeight = value;
      layoutHeight = dpr > 0 ? value / dpr : value;
      if (nativeCanvas.height !== value) {
        nativeCanvas.height = value;
      }
    },
    get clientWidth() {
      return layoutWidth;
    },
    get clientHeight() {
      return layoutHeight;
    },
    getContext(type: string) {
      return type === "2d" ? context : null;
    },
    setAttribute(name: string, value: string) {
      attributes.set(name, value);
    },
    getAttribute(name: string) {
      return attributes.get(name) ?? null;
    },
    addEventListener(_type: string, _listener: unknown) {},
    removeEventListener(_type: string, _listener: unknown) {},
    toDataURL(type?: string, quality?: any) {
      return typeof nativeCanvas.toDataURL === "function"
        ? nativeCanvas.toDataURL(type, quality)
        : "";
    }
  };
}

export function flushCanvas(context: CanvasRenderingContext2D): boolean {
  const drawable = context as DrawableCanvasContext;

  if (typeof drawable.draw !== "function") {
    return false;
  }

  drawable.draw();
  return true;
}

export function enableEChartsDirtyRectPainter(
  painter: CanvasPainterLike | null | undefined
): boolean {
  if (
    painter == null
    || painter._opts == null
    || typeof painter._paintPerCursor !== "function"
    || typeof painter._paintPerCursorInRect !== "function"
  ) {
    return false;
  }

  painter._paintPerCursor = function (
    this: CanvasPainterLike,
    layer: any,
    cursor: any,
    list: any[],
    repaintRects: any[] | null | undefined,
    contentRetained: boolean
  ) {
    const context = layer.ctx;

    if (repaintRects == null) {
      context.save();
      this._paintPerCursorInRect!(layer, cursor, list, null, contentRetained);
      context.restore();
    } else if (repaintRects.length === 0) {
      cursor.drawIdx = cursor.endIdx;
    } else {
      let minX = repaintRects[0].x;
      let minY = repaintRects[0].y;
      let maxX = minX + repaintRects[0].width;
      let maxY = minY + repaintRects[0].height;

      for (let i = 1; i < repaintRects.length; i++) {
        const rect = repaintRects[i];

        minX = Math.min(minX, rect.x);
        minY = Math.min(minY, rect.y);
        maxX = Math.max(maxX, rect.x + rect.width);
        maxY = Math.max(maxY, rect.y + rect.height);
      }

      const paintRect = {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
      };
      let expanded = true;

      // The native canvas does not apply zrender's outer repaint clip correctly.
      // Expand the paint region until every intersecting element is fully inside it,
      // so painting whole elements cannot cover content outside the dirty area.
      while (expanded) {
        expanded = false;

        for (let i = cursor.drawIdx; i < cursor.endIdx; i++) {
          const el = list[i];
          const rect = el?.getPaintRect?.();
          if (rect == null || !rect.intersect(paintRect)) {
            continue;
          }

          const maxPaintX = paintRect.x + paintRect.width;
          const maxPaintY = paintRect.y + paintRect.height;
          const maxRectX = rect.x + rect.width;
          const maxRectY = rect.y + rect.height;

          if (
            rect.x < paintRect.x
            || rect.y < paintRect.y
            || maxRectX > maxPaintX
            || maxRectY > maxPaintY
          ) {
            const nextX = Math.min(paintRect.x, rect.x);
            const nextY = Math.min(paintRect.y, rect.y);

            paintRect.width = Math.max(maxPaintX, maxRectX) - nextX;
            paintRect.height = Math.max(maxPaintY, maxRectY) - nextY;
            paintRect.x = nextX;
            paintRect.y = nextY;
            expanded = true;
          }
        }
      }

      context.save();
      this._paintPerCursorInRect!(layer, cursor, list, paintRect, contentRetained);
      context.restore();
    }

    return cursor.drawIdx >= cursor.endIdx;
  };

  painter._opts.useDirtyRect = true;

  return true;
}

export function getBrowserCanvasDataURL(
  canvasId: string,
  options?: Record<string, any>
): string | null {
  const browser = globalThis as any;
  const document = browser?.document;

  if (document == null || typeof document.getElementById !== "function") {
    return null;
  }

  const host = document.getElementById(canvasId);
  if (host == null) {
    return null;
  }

  const source = typeof host.querySelector === "function"
    ? host.querySelector("canvas")
    : host;

  if (source == null || typeof source.toDataURL !== "function") {
    return null;
  }

  const mime = normalizeDataURLType(options);
  const quality = typeof options?.quality === "number" ? options.quality : undefined;
  const rect = typeof source.getBoundingClientRect === "function"
    ? source.getBoundingClientRect()
    : null;
  const sourceWidth = source.width;
  const sourceHeight = source.height;
  const requestedRatio = Number(options?.pixelRatio);
  const pixelRatio = Number.isFinite(requestedRatio) && requestedRatio > 0
    ? requestedRatio
    : (rect != null && rect.width > 0 ? sourceWidth / rect.width : 1);
  const outputWidth = rect != null && rect.width > 0
    ? Math.round(rect.width * pixelRatio)
    : Math.round(sourceWidth * pixelRatio);
  const outputHeight = rect != null && rect.height > 0
    ? Math.round(rect.height * pixelRatio)
    : Math.round(sourceHeight * pixelRatio);
  const backgroundColor = options?.backgroundColor;
  const needsComposite = backgroundColor != null
    || outputWidth !== sourceWidth
    || outputHeight !== sourceHeight;

  if (!needsComposite) {
    return source.toDataURL(mime, quality);
  }

  if (typeof document.createElement !== "function") {
    return source.toDataURL(mime, quality);
  }

  const output = document.createElement("canvas");
  output.width = outputWidth;
  output.height = outputHeight;
  const context = output.getContext("2d");

  if (context == null) {
    return source.toDataURL(mime, quality);
  }

  if (backgroundColor != null) {
    context.fillStyle = String(backgroundColor);
    context.fillRect(0, 0, outputWidth, outputHeight);
  }

  context.drawImage(source, 0, 0, outputWidth, outputHeight);
  return output.toDataURL(mime, quality);
}

export function getNativeCanvasDataURL(
  canvas: NativeCanvasLike | null,
  options?: Record<string, any>
): string {
  if (canvas == null || typeof canvas.toDataURL !== "function") {
    return "";
  }

  const quality = typeof options?.quality === "number" ? options.quality : undefined;

  return canvas.toDataURL(normalizeDataURLType(options), quality);
}

function fallbackMeasureText(text: string, font?: string): TextMetrics {
  const match = /(\d+(?:\.\d+)?|\.\d+)px/.exec(font ?? "");
  const fontSize = match == null ? 12 : Number(match[1]);
  const width = text.length * (Number.isFinite(fontSize) && fontSize > 0 ? fontSize * 0.55 : 6);

  return { width } as TextMetrics;
}

export function releaseEChartsPlatformContext(
  context: CanvasRenderingContext2D
): void {
  const index = measureContexts.indexOf(context);

  if (index >= 0) {
    measureContexts.splice(index, 1);
  }
}

export function createPlatformCanvas(): HTMLCanvasElement | null {
  const browser = globalThis as any;
  const document = browser?.document;

  if (document == null || typeof document.createElement !== "function") {
    return null;
  }

  const canvas = document.createElement("canvas") as HTMLCanvasElement | null;

  return canvas != null && typeof canvas.getContext === "function" ? canvas : null;
}

export function installEChartsPlatformAPI(
  echarts: typeof ECharts,
  context: CanvasRenderingContext2D
): void {
  if (!measureContexts.includes(context)) {
    measureContexts.push(context);
  }

  echarts.setPlatformAPI({
    createCanvas: () => {
      const canvas = createPlatformCanvas();

      if (canvas == null) {
        throw new Error(
          "[uni-echarts-x] createCanvas requires a browser document. "
          + "Offscreen canvas features are unavailable on this platform."
        );
      }

      return canvas;
    },
    measureText: (text: string, font?: string) => {
      const current = measureContexts[0];

      if (current == null) {
        return fallbackMeasureText(text, font);
      }

      try {
        current.save();

        if (font != null && font.length > 0) {
          current.font = font;
        }

        const measured = current.measureText(text);
        current.restore();

        return measured;
      } catch {
        releaseEChartsPlatformContext(current);
        return fallbackMeasureText(text, font);
      }
    }
  });
}
