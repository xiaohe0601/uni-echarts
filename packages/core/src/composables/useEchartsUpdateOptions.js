import { computed, inject, provide, toValue } from "vue";
import { defaultTo } from "../utils/helpers";

export const UPDATE_OPTIONS_KEY = Symbol("UniEcharts.updateOptions");

export function provideEchartsUpdateOptions(value) {
  provide(UPDATE_OPTIONS_KEY, value);
}

export function useEchartsUpdateOptions(value) {
  const injectUpdateOptions = inject(UPDATE_OPTIONS_KEY, null);

  const unwrapInjectUpdateOptions = computed(() => {
    return toValue(injectUpdateOptions);
  });

  const innerUpdateOptions = computed(() => {
    return defaultTo(toValue(value), unwrapInjectUpdateOptions.value, {});
  });

  return {
    injectUpdateOptions: unwrapInjectUpdateOptions,
    innerUpdateOptions
  };
}