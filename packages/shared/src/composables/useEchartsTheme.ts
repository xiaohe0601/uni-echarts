import type { ComputedRef, InjectionKey, MaybeRefOrGetter } from "vue";
import { computed, inject, provide, toValue } from "vue";
import type { ChartTheme, ChartThemeInjection, NullableValue, OptionalValue } from "../types";
import { defaultTo } from "../utils";

export const THEME_KEY: InjectionKey<ChartThemeInjection> = Symbol("UniEcharts.theme");

export function provideEchartsTheme(value: ChartThemeInjection): void {
  provide(THEME_KEY, value);
}

export function useEchartsTheme(value: MaybeRefOrGetter<OptionalValue<ChartTheme>>): {
  injectTheme: ComputedRef<NullableValue<ChartTheme>>;
  innerTheme: ComputedRef<ChartTheme>;
} {
  const injectTheme = inject(THEME_KEY, null);

  const unwrapInjectTheme = computed(() => {
    return toValue(injectTheme);
  });

  const innerTheme = computed(() => {
    return defaultTo(toValue(value), unwrapInjectTheme.value, {});
  });

  return {
    injectTheme: unwrapInjectTheme,
    innerTheme
  };
}