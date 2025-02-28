import { computed, inject, provide, toValue } from "vue";
import { defaultTo } from "../utils/helpers";

export const INIT_OPTIONS_KEY = Symbol("UniEcharts.initOptions");

export function provideEchartsInitOptions(value) {
  provide(INIT_OPTIONS_KEY, value);
}

export function useEchartsInitOptions(value) {
  const injectInitOptions = inject(INIT_OPTIONS_KEY, null);

  const unwrapInjectInitOptions = computed(() => {
    return toValue(injectInitOptions);
  });

  const innerInitOptions = computed(() => {
    return defaultTo(toValue(value), unwrapInjectInitOptions.value, {});
  });

  return {
    injectInitOptions: unwrapInjectInitOptions,
    innerInitOptions
  };
}