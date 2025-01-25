import type { ComputedRef, InjectionKey, MaybeRefOrGetter } from "vue";
import type { ChartTheme, ChartThemeInjection } from "../components/uni-echarts/types";
import type { NullableValue, OptionalValue } from "../types";

export declare const THEME_KEY: InjectionKey<ChartThemeInjection>;

export declare function provideEchartsTheme(value: ChartThemeInjection): void;

export declare function useEchartsTheme(value: MaybeRefOrGetter<OptionalValue<ChartTheme>>): {
  injectTheme: ComputedRef<NullableValue<ChartTheme>>;
  innerTheme: ComputedRef<ChartTheme>;
};