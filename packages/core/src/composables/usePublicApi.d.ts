import type { Ref } from "vue";
import type { EChartsType } from "../components/uni-echarts/types";
import type { NullableValue } from "../types";

export type PublicApi = Pick<
  EChartsType,
  "getWidth" |
  "getHeight" |
  "getDom" |
  "getOption" |
  "dispatchAction" |
  "convertToPixel" |
  "convertFromPixel" |
  "containPixel" |
  "getDataURL" |
  "getConnectedDataURL" |
  "appendData" |
  "clear" |
  "isDisposed" |
  "dispose"
>;

export declare function usePublicApi(chart: Ref<NullableValue<EChartsType>>): PublicApi;