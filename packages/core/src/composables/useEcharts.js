import { init, registerPreprocessor, setPlatformAPI, throttle, use } from "echarts";
import { inject, provide } from "vue";

export const ECHARTS_KEY = Symbol("UniEcharts.echarts");

export function provideEcharts(echarts) {
  provide(ECHARTS_KEY, echarts);
}

export function useEcharts() {
  return inject(ECHARTS_KEY, {
    init,
    registerPreprocessor,
    setPlatformAPI,
    use,
    throttle
  });
}