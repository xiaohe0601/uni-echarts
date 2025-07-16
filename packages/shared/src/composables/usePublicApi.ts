import type { Ref } from "vue";
import type { EChartsType, NullableValue } from "../types";

const ECHARTS_APIS = [
  "getWidth",
  "getHeight",
  "getDom",
  "getOption",
  "dispatchAction",
  "convertToPixel",
  "convertFromPixel",
  "containPixel",
  "getDataURL",
  "getConnectedDataURL",
  "appendData",
  "clear",
  "isDisposed",
  "dispose"
] as const;

type EChartsApi = (typeof ECHARTS_APIS)[number];

export type PublicApi = Pick<EChartsType, EChartsApi>;

export function usePublicApi(chart: Ref<NullableValue<EChartsType>>): PublicApi {
  function makePublicMethod<T extends EChartsApi>(
    name: T
  ): (...args: Parameters<EChartsType[T]>) => ReturnType<EChartsType[T]> {
    return (...args) => {
      if (chart.value == null) {
        throw new Error("ECharts is not initialized yet.");
      }

      return (chart.value[name] as any).apply(chart.value, args);
    };
  }

  function makePublicMethods(): PublicApi {
    const methods = Object.create(null);

    for (const name of ECHARTS_APIS) {
      methods[name] = makePublicMethod(name);
    }

    return methods as PublicApi;
  }

  return makePublicMethods();
}