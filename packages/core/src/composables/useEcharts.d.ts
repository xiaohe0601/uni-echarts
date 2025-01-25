import type * as Echarts from "echarts/core";
import type { InjectionKey } from "vue";

export type MinifyEcharts = Pick<
  typeof Echarts,
  "init" | "registerPreprocessor" | "setPlatformAPI" | "use" | "throttle"
>;

export declare const ECHARTS_KEY: InjectionKey<MinifyEcharts>;

export declare function provideEcharts(echarts: MinifyEcharts): void;

export declare function useEcharts(): MinifyEcharts;