import { computed, inject, provide, toValue } from "vue";
import { defaultTo, isEmpty } from "../utils/helpers";

export const OPTION_KEY = "UniEcharts.option";

export function getEchartsOptionKey(key) {
  if (isEmpty(key)) {
    return OPTION_KEY;
  }

  return `${OPTION_KEY}_${key}`;
}

export function provideEchartsOption(keyOrValue, value) {
  if (typeof keyOrValue === "string") {
    provide(getEchartsOptionKey(keyOrValue), value);
    return;
  }

  provide(getEchartsOptionKey(), keyOrValue);
}

export function useEchartsOption(key, value) {
  const injectOption = inject(getEchartsOptionKey(key), null);

  const unwrapInjectOption = computed(() => {
    return toValue(injectOption);
  });

  const innerOption = computed(() => {
    return defaultTo(toValue(value), unwrapInjectOption.value);
  });

  return {
    injectOption: unwrapInjectOption,
    innerOption
  };
}