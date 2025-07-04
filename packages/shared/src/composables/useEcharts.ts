import type * as Echarts from "echarts/core";
import { init, registerPreprocessor, setPlatformAPI, throttle, use } from "echarts/core";
import type { InjectionKey } from "vue";
import { inject, provide } from "vue";

export type MinifyEcharts = Pick<
  typeof Echarts,
  | "init"
  | "registerPreprocessor"
  | "setPlatformAPI"
  | "throttle"
  | "use"
>;

export const ECHARTS_KEY: InjectionKey<MinifyEcharts> = Symbol("UniEcharts.echarts");

export function provideEcharts(echarts: MinifyEcharts): void {
  provide(ECHARTS_KEY, echarts);
}

export function useEcharts(): MinifyEcharts {
  return inject(ECHARTS_KEY, {
    init,
    registerPreprocessor,
    setPlatformAPI,
    use,
    throttle
  });
}