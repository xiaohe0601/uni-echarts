import type { init, SetOptionOpts } from "echarts/core";
import type { Injection } from "./vue";

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