import { computed, inject, provide, toValue } from "vue";
import { defaultTo } from "../utils/helpers";

export const THEME_KEY = Symbol("UniEcharts.theme");

export function provideEchartsTheme(value) {
  provide(THEME_KEY, value);
}

export function useEchartsTheme(value) {
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