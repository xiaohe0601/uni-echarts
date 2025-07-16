import type { ComputedRef, InjectionKey, MaybeRefOrGetter } from "vue";
import { computed, inject, provide, toValue } from "vue";
import type { InitOptions, InitOptionsInjection, NullableValue, OptionalValue } from "../types";
import { defaultTo } from "../utils";

export const INIT_OPTIONS_KEY: InjectionKey<InitOptionsInjection> = Symbol("UniEcharts.initOptions");

export function provideEchartsInitOptions(value: InitOptionsInjection): void {
  provide(INIT_OPTIONS_KEY, value);
}

export function useEchartsInitOptions(value: MaybeRefOrGetter<OptionalValue<InitOptions>>): {
  injectInitOptions: ComputedRef<NullableValue<InitOptions>>;
  innerInitOptions: ComputedRef<InitOptions>;
} {
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