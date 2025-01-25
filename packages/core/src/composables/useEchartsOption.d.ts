import type { ComputedRef, MaybeRefOrGetter } from "vue";
import type { ChartOption, ChartOptionInjection } from "../components/uni-echarts/types";
import type { NullableValue, OptionalValue } from "../types";

export declare const OPTION_KEY: "UniEcharts.option";

export declare function getEchartsOptionKey(key?: string): string;

export declare function provideEchartsOption(value: ChartOptionInjection): void;
export declare function provideEchartsOption(key: string, value: ChartOptionInjection): void;
export declare function provideEchartsOption(keyOrValue: string | ChartOptionInjection, value?: ChartOptionInjection): void;

export declare function useEchartsOption(key: OptionalValue<string>, value: MaybeRefOrGetter<OptionalValue<ChartOption>>): {
  injectOption: ComputedRef<NullableValue<ChartOption>>;
  innerOption: ComputedRef<NullableValue<ChartOption>>;
};