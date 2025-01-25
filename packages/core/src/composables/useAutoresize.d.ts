import type { MaybeRefOrGetter, Ref } from "vue";
import type { AutoResize, EChartsType } from "../components/uni-echarts/types";
import type { NullableValue } from "../types";
import type { MinifyEcharts } from "./useEcharts";

export declare function useAutoresize(chart: Ref<NullableValue<EChartsType>>, options: {
  echarts: MinifyEcharts;
  autoresize: MaybeRefOrGetter<AutoResize>;
  root: Ref<NullableValue<HTMLElement>>;
}): void;