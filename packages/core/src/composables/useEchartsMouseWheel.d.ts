import type { Ref } from "vue";
import type { EChartsType, GetTouchFuc } from "../components/uni-echarts/types";
import type { NullableValue } from "../types";

export declare function useEchartsMouseWheel(options: {
  isPc: boolean;
  chart: Ref<NullableValue<EChartsType>>;
  getTouch: GetTouchFuc;
}): void;