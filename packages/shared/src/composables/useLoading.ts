import type { InjectionKey, MaybeRefOrGetter, Ref } from "vue";
import { computed, inject, provide, toValue, watchEffect } from "vue";
import type { EChartsType, LoadingOptions, LoadingOptionsInjection, NullableValue, OptionalValue } from "../types";
import { defaultTo } from "../utils";

export const LOADING_OPTIONS_KEY: InjectionKey<LoadingOptionsInjection> = Symbol("UniEcharts.loadingOptions");

export function provideEchartsLoadingOptions(value: LoadingOptionsInjection): void {
  provide(LOADING_OPTIONS_KEY, value);
}

export function useLoading(chart: Ref<NullableValue<EChartsType>>, {
  loading,
  loadingOptions
}: {
  loading: MaybeRefOrGetter<boolean>;
  loadingOptions: MaybeRefOrGetter<OptionalValue<LoadingOptions>>;
}): void {
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