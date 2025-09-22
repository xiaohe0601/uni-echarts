import type * as Echarts from "echarts/core";
import type { InjectionKey } from "vue";
import { inject, provide } from "vue";

export type CoreEcharts = typeof Echarts;

export const ECHARTS_KEY: InjectionKey<CoreEcharts> = Symbol("UniEcharts.echarts");

export function provideEcharts(echarts: CoreEcharts): void {
  provide(ECHARTS_KEY, echarts);
}

export function useEcharts(): CoreEcharts {
  return inject(ECHARTS_KEY)!;
}