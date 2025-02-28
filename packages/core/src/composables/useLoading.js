import { computed, inject, provide, toValue, watchEffect } from "vue";
import { defaultTo } from "../utils/helpers";

export const LOADING_OPTIONS_KEY = Symbol("UniEcharts.loadingOptions");

export function provideEchartsLoadingOptions(value) {
  provide(LOADING_OPTIONS_KEY, value);
}

export function useLoading(chart, {
  loading,
  loadingOptions
}) {
  const injectLoadingOptions = inject(LOADING_OPTIONS_KEY, null);

  const unwrapInjectLoadingOptions = computed(() => {
    return toValue(injectLoadingOptions);
  });

  const innerLoadingOptions = computed(() => {
    return {
      ...defaultTo(unwrapInjectLoadingOptions.value, {}),
      ...defaultTo(toValue(loadingOptions), {})
    };
  });

  watchEffect(() => {
    const instance = chart.value;

    if (instance == null) {
      return;
    }

    if (toValue(loading)) {
      instance.showLoading(innerLoadingOptions.value);
    } else {
      instance.hideLoading();
    }
  });
}