import type { ECElementEvent, ElementEvent, init, SetOptionOpts } from "echarts/core";
import type { StyleValue } from "vue";
import type { PublicApi } from "../../composables/usePublicApi";
import type { Injection, NullableValue } from "../../types";

type InitType = typeof init;
export type InitParameters = Parameters<InitType>;

export type ChartTheme = NonNullable<InitParameters[1]>;
export type ChartThemeInjection = Injection<ChartTheme>;

export type InitOptions = NonNullable<InitParameters[2]>;
export type InitOptionsInjection = Injection<InitOptions>;

export type UpdateOptions = SetOptionOpts;
export type UpdateOptionsInjection = Injection<UpdateOptions>;

export type EChartsType = ReturnType<InitType>;
export type ZRenderType = ReturnType<EChartsType["getZr"]>;
export type ZRenderHandler = ZRenderType["handler"];

type SetOptionType = EChartsType["setOption"];

export type ChartOption = Parameters<SetOptionType>[0];
export type ChartOptionInjection = Injection<ChartOption>;

export type AutoResize = boolean | {
  throttle?: number;
  onResize?: () => void;
};

export interface LoadingOptions {
  text?: string;
  textColor?: string;
  fontSize?: number | string;
  fontWeight?: number | string;
  fontStyle?: string;
  fontFamily?: string;
  maskColor?: string;
  showSpinner?: boolean;
  color?: string;
  spinnerRadius?: number;
  lineWidth?: number;
  zlevel?: number;
}

export type LoadingOptionsInjection = Injection<LoadingOptions>;

export interface UniEchartsProps {
  /**
   * Custom root el class.
   */
  customClass?: any;
  /**
   * Custom root el style.
   */
  customStyle?: StyleValue;
  /**
   * Same as the option of echarts.
   */
  option?: ChartOption;
  /**
   * Option inject key.
   */
  optionKey?: string;
  /**
   * Theme to be applied.
   */
  theme?: ChartTheme;
  /**
   * Optional chart init configurations.
   */
  initOptions?: InitOptions;
  /**
   * Options for updating chart option.
   */
  updateOptions?: UpdateOptions;
  /**
   * Group name to be used in chart connection.
   */
  group?: string;
  /**
   * For performance critical scenarios (having a large dataset) we'd better bypass Vue's reactivity system for `option` prop.
   */
  manualUpdate?: boolean;
  /**
   * Whether the chart should be resized automatically whenever its root is resized.
   */
  autoresize?: AutoResize;
  /**
   * Whether the chart is in loading state.
   */
  loading?: boolean;
  /**
   * Configuration item of loading animation.
   */
  loadingOptions?: LoadingOptions;
  /**
   * Canvas type.
   */
  canvasType?: "2d" | "legacy";
  /**
   * Prevent screen scroll when touching the canvas.
   */
  disableScroll?: boolean;
  /**
   * Support mouse hover behavior in PC.
   */
  supportHover?: boolean;
  /**
   * Init delay time(ms).
   */
  initDelay?: number;
}

type MouseEventName =
  | "click"
  | "dblclick"
  | "mouseout"
  | "mouseover"
  | "mouseup"
  | "mousedown"
  | "mousemove"
  | "contextmenu"
  | "globalout";

type ElementEventName =
  | MouseEventName
  | "mousewheel"
  | "drag"
  | "dragstart"
  | "dragend"
  | "dragenter"
  | "dragleave"
  | "dragover"
  | "drop";

type ZRenderEventName = `zr:${ElementEventName}`;

type OtherEventName =
  | "highlight"
  | "downplay"
  | "selectchanged"
  | "legendselectchanged"
  | "legendselected"
  | "legendunselected"
  | "legendselectall"
  | "legendinverseselect"
  | "legendscroll"
  | "datazoom"
  | "datarangeselected"
  | "graphroam"
  | "georoam"
  | "treeroam"
  | "timelinechanged"
  | "timelineplaychanged"
  | "restore"
  | "dataviewchanged"
  | "magictypechanged"
  | "geoselectchanged"
  | "geoselected"
  | "geounselected"
  | "axisareaselected"
  | "brush"
  | "brushEnd"
  | "brushselected"
  | "globalcursortaken";

type UniEventName =
  | "touchstart"
  | "touchmove"
  | "touchcancel"
  | "touchend"
  | "tap"
  | "longpress"
  | "longtap"
  | "transitionend"
  | "animationstart"
  | "animationiteration"
  | "animationend"
  | "touchforcechange";

type NativeEventName = `native:${ElementEventName}` | `native:${UniEventName}`;

type MouseEmits = {
  [key in MouseEventName]: (params: ECElementEvent) => void;
};

type ZRenderEmits = {
  [key in ZRenderEventName]: (params: ElementEvent) => void;
};

type OtherEmits = {
  [key in OtherEventName]: (params: any) => void;
};

type NativeEmits = {
  [key in NativeEventName]: (params: any) => void;
};

export type UniEchartsEmits = MouseEmits & ZRenderEmits & OtherEmits & NativeEmits & {
  rendered: (params: { elapsedTime: number }) => void;
  finished: () => void;
};

export interface UniEchartsInst extends PublicApi, Pick<
  EChartsType,
  "setOption" | "resize"
> {
  root: NullableValue<HTMLElement>;
  canvasId: string;
  chart: NullableValue<EChartsType>;
  toTempFilePath: (options?: Omit<UniApp.CanvasToTempFilePathOptions, "canvasId" | "canvas">) => Promise<UniApp.CanvasToTempFilePathRes>;
}

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
  (event: TouchEvent, touches: TouchList): NormalizedTouch;

  (event: MouseEvent): NormalizedTouch;

  (event: TouchEvent | MouseEvent, touches?: TouchList): NormalizedTouch;
}