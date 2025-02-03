import type { ZRenderHandler } from "../components/uni-echarts/types";
import type { MinifyEcharts } from "../composables/useEcharts";
import type { NullableValue, OptionalValue } from "../types";
import type { Emitter, EventType } from "./mitt";

export type CanvasNode = UniApp.NodeCallbackResult["node"];
export type CanvasContext = UniApp.CanvasContext;

export declare class UniCanvas {

  tagName: "canvas";

  attrs: Record<string, any>;

  canvasId: string;
  context: CanvasContext;
  canvasNode: NullableValue<CanvasNode>;

  private _emitter: Emitter<Record<EventType, any>>;

  constructor(canvasId: string, context: CanvasContext, canvasNode: NullableValue<CanvasNode>);

  private _setupContext(context: CanvasContext): void;

  get width(): number;
  set width(value: number);

  get height(): number;
  set height(value: number);

  getContext(type: "2d"): OptionalValue<CanvasContext>;

  setAttribute(key: string, value: any): void;

  getAttribute(key: string): any;

  addEventListener(type: string, listener: (event: Event) => void): void;

  removeEventListener(type: string, listener: (event: Event) => void): void;

  dispatchEvent(type: string | Event, event?: Event): boolean;

  attachEvent(): void;

  detachEvent(): void;

  toTempFilePath(options?: Omit<UniApp.CanvasToTempFilePathOptions, "canvasId" | "canvas">): Promise<UniApp.CanvasToTempFilePathRes>;

  static parseFontSize(font: string): number;

  static normalizeColor(context: CanvasContext, color: string | object): string | object;

  static dispatch(
    handler: ZRenderHandler,
    event: Parameters<ZRenderHandler["dispatch"]>[0],
    touch: Parameters<ZRenderHandler["dispatch"]>[1]
  ): void;

}

export declare class UniImage {

  tagName: "img";

  width: number;
  height: number;

  private _src: NullableValue<string>;

  constructor();

  get src(): NullableValue<string>;
  set src(value: NullableValue<string>);

  onload?: (res: UniApp.GetImageInfoSuccessData) => void;
  onerror?: (err: any) => void;

}

export declare function setupEchartsCanvas(echarts: MinifyEcharts, options: {
  canvas: UniCanvas;
  node: NullableValue<CanvasNode>;
}): void;