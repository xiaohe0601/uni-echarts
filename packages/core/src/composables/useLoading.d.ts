import type { InjectionKey, MaybeRefOrGetter, Ref } from "vue";
import type { EChartsType, LoadingOptions, LoadingOptionsInjection } from "../components/uni-echarts/types";
import type { NullableValue, OptionalValue } from "../types";

export declare const LOADING_OPTIONS_KEY: InjectionKey<LoadingOptionsInjection>;

export declare function provideEchartsLoadingOptions(value: LoadingOptionsInjection): void;

export declare function useLoading(chart: Ref<NullableValue<EChartsType>>, options: {
  loading: MaybeRefOrGetter<boolean>;
  loadingOptions: MaybeRefOrGetter<OptionalValue<LoadingOptions>>;
}): void;