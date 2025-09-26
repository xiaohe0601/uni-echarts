import type { CoreEcharts } from "../composables";
import type { NullableValue, OptionalValue, ZRenderHandler } from "../types";
import { defaultTo, isEmpty, lowerFirst, upperFirst } from "./helpers";
import type { Emitter, EventType } from "./mitt";
import { mitt } from "./mitt";
import { getDeviceInfo } from "./uni";

export type CanvasNode = UniApp.NodeCallbackResult["node"];
export type CanvasContext = UniApp.CanvasContext;

const SHORT_HEX_REGEX = /#([0-9a-f])([0-9a-f])([0-9a-f])\b/gi;

export class UniCanvas {

  tagName = "canvas" as const;

  attrs: Record<string, any> = {};

  canvasId: string;
  context: CanvasContext;
  canvasNode: NullableValue<CanvasNode>;

  private _emitter: Emitter<Record<EventType, any>>;

  constructor(canvasId: string, context: CanvasContext, canvasNode: NullableValue<CanvasNode>) {
    this.canvasId = canvasId;
    this.context = context;
    this.canvasNode = canvasNode;

    if (canvasNode == null) {
      this._setupContext(context);
    }

    this._emitter = mitt();
  }

  private _setupContext(context: CanvasContext): void {
    const styles = [
      "fillStyle",
      "fontSize",
      "globalAlpha",
      "lineCap",
      "lineDash",
      "lineJoin",
      "lineWidth",
      "miterLimit",
      "strokeStyle",
      "textAlign",
      "textBaseline",
      "opacity",
      "shadowOffsetX",
      "shadowOffsetY",
      "shadowBlur",
      "shadowColor",
      "font"
    ];

    const shadow = {
      offsetX: 0,
      offsetY: 0,
      blur: 0,
      color: "#000000"
    };

    for (const key of styles) {
      // eslint-disable-next-line accessor-pairs
      Object.defineProperty(context, key, {
        set(value) {
          if (key === "opacity") {
            context.setGlobalAlpha(value);
            return;
          }

          if (key === "font") {
            context.setFontSize(UniCanvas.parseFontSize(value));
            return;
          }

          if (key.indexOf("shadow") === 0) {
            if (key !== "shadowColor") {
              // @ts-expect-error whatever
              shadow[lowerFirst(key.slice(6))] = value;
            } else {
              shadow.color = UniCanvas.normalizeColor(context, value);

              context.setShadow(
                shadow.offsetX,
                shadow.offsetY,
                shadow.blur,
                shadow.color
              );
            }
            return;
          }

          if (key === "fillStyle" || key === "strokeStyle") {
            value = UniCanvas.normalizeColor(context, value);
          }

          // @ts-expect-error whatever
          context[`set${upperFirst(key)}`](value);
        }
      });
    }

    const _drawImage = context.drawImage;
    context.drawImage = (...args) => {
      // @ts-expect-error whatever
      _drawImage(args[0].src, ...args.slice(1));
    };

    if (context.strokeText == null) {
      context.strokeText = (...args) => {
        context.fillText(...args);
      };
    }

    // @ts-expect-error whatever
    if (context.createRadialGradient == null) {
      // @ts-expect-error whatever
      context.createRadialGradient = (...args) => {
        // @ts-expect-error whatever
        return context.createCircularGradient(...args.slice(-3));
      };
    }

    // @ts-expect-error whatever
    if (context.measureText == null || getDeviceInfo().osName === "harmonyos") {
      const strlen = (str: string) => {
        let len = 0;

        for (let i = 0; i < str.length; i += 1) {
          const unicode = str.charCodeAt(i);

          if (unicode > 0 && unicode < 128) {
            len += 1;
          } else {
            len += 2;
          }
        }

        return len;
      };

      // @ts-expect-error whatever
      context.measureText = (text: string, font: string) => {
        const fontSize = defaultTo(
          // @ts-expect-error whatever
          context.state && context.state.fontSize,
          UniCanvas.parseFontSize(font),
          12
        ) / 2;

        const factor = fontSize >= 16 ? 1.3 : 1;

        return {
          width: strlen(text) * fontSize * factor
        };
      };
    }
  }

  get width(): number {
    if (this.canvasNode == null) {
      return this.getAttribute("width");
    }

    return this.canvasNode.width;
  }

  set width(value: number) {
    if (this.canvasNode == null) {
      this.setAttribute("width", value);
      return;
    }

    this.canvasNode.width = value;
  }

  get height(): number {
    if (this.canvasNode == null) {
      return this.getAttribute("height");
    }

    return this.canvasNode.height;
  }

  set height(value: number) {
    if (this.canvasNode == null) {
      this.setAttribute("height", value);
      return;
    }

    this.canvasNode.height = value;
  }

  getContext(type: "2d"): OptionalValue<CanvasContext> {
    if (type === "2d") {
      return this.context;
    }
  }

  setAttribute(key: string, value: any): void {
    this.attrs[key] = value;
  }

  getAttribute(key: string): any {
    return this.attrs[key];
  }

  addEventListener(type: string, listener: (event: Event) => void): void {
    this._emitter.on(type, listener);
  }

  removeEventListener(type: string, listener: (event: Event) => void): void {
    this._emitter.off(type, listener);
  }

  dispatchEvent(type: string | Event, event?: Event): boolean {
    if (typeof type === "object") {
      this._emitter.emit(type.type, type);
    } else {
      this._emitter.emit(type, event);
    }

    return true;
  }

  attachEvent(): void {
    // noop
  }

  detachEvent(): void {
    // noop
  }

  requestAnimationFrame(callback: () => void): number {
    if (this.canvasNode != null && typeof this.canvasNode.requestAnimationFrame === "function") {
      return this.canvasNode.requestAnimationFrame(callback);
    }

    if (typeof requestAnimationFrame === "function") {
      return requestAnimationFrame(callback);
    }

    return setTimeout(callback, 1000 / 60);
  }

  cancelAnimationFrame(id: number): void {
    if (this.canvasNode != null && typeof this.canvasNode.cancelAnimationFrame === "function") {
      this.canvasNode.cancelAnimationFrame(id);
      return;
    }

    if (typeof cancelAnimationFrame === "function") {
      cancelAnimationFrame(id);
      return;
    }

    clearTimeout(id);
  }

  toTempFilePath(options: Omit<UniApp.CanvasToTempFilePathOptions, "canvasId" | "canvas"> = {}): Promise<UniApp.CanvasToTempFilePathRes> {
    const opts: Partial<
      Pick<
        UniApp.CanvasToTempFilePathOptions,
        | "canvas"
        | "canvasId"
      >
    > = {};

    if (this.canvasNode != null) {
      opts.canvas = this.canvasNode;
    } else {
      opts.canvasId = this.canvasId;
    }

    return uni.canvasToTempFilePath({
      ...opts as UniApp.CanvasToTempFilePathOptions,
      ...options
    });
  }

  static parseFontSize(font: string): number {
    return Number.parseFloat(defaultTo(font, "").match(/([\d.]+)px/)[1]);
  }

  static normalizeColor(context: CanvasContext, color: string): string;
  static normalizeColor(context: CanvasContext, color: object): object;
  static normalizeColor(context: CanvasContext, color: string | object): string | object {
    if (typeof color === "string") {
      // #ifdef MP-TOUTIAO
      SHORT_HEX_REGEX.lastIndex = 0;

      if (SHORT_HEX_REGEX.test(color)) {
        return color.replace(SHORT_HEX_REGEX, "#$1$1$2$2$3$3");
      }
      // #endif
    }

    return color;
  }

  static dispatch(
    handler: ZRenderHandler,
    event: Parameters<ZRenderHandler["dispatch"]>[0],
    touch: Parameters<ZRenderHandler["dispatch"]>[1]
  ): void {
    handler.dispatch(event, {
      zrX: touch.x,
      zrY: touch.y,
      zrDelta: touch.wheelDelta,
      preventDefault: () => {},
      stopImmediatePropagation: () => {},
      stopPropagation: () => {}
    });
  }

}

export class UniImage {

  tagName = "img" as const;

  width: number;
  height: number;

  onload?: (res: UniApp.GetImageInfoSuccessData) => void;
  onerror?: (err: any) => void;

  private _src: NullableValue<string>;

  constructor() {
    this._src = null;
    this.width = 0;
    this.height = 0;
  }

  get src(): NullableValue<string> {
    return this._src;
  }

  set src(value: string) {
    this._src = value;

    uni.getImageInfo({
      src: value,
      success: (res) => {
        this.width = res.width;
        this.height = res.height;

        if (this.onload) {
          this.onload(res);
        }
      },
      fail: (err) => {
        if (this.onerror) {
          this.onerror(err);
        }
      }
    });
  }

}

export function setupEchartsCanvas(echarts: CoreEcharts, {
  canvas,
  node
}: {
  canvas: UniCanvas;
  node: NullableValue<CanvasNode>;
}): void {
  echarts.registerPreprocessor((option) => {
    if (option == null) {
      return;
    }

    if (option.series != null) {
      if (Array.isArray(option.series)) {
        if (!isEmpty(option.series)) {
          for (const item of option.series) {
            item.progressive = 0;
          }
        }
      } else if (typeof option.series === "object") {
        // @ts-expect-error whatever
        option.series.progressive = 0;
      }
    }
  });

  const loadImage = (
    src: string,
    onload: () => void,
    onerror: () => void
  ) => {
    if (node != null && node.createImage) {
      const image = node.createImage();
      image.onload = onload;
      image.onerror = onerror;
      image.src = src;
      return image;
    }

    const image = new UniImage();
    image.onload = onload;
    image.onerror = onerror;
    image.src = src;
    return image;
  };

  echarts.setPlatformAPI({
    loadImage: node != null ? loadImage : undefined,
    createCanvas() {
      return canvas as unknown as HTMLCanvasElement;
    }
  });
}