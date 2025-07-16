import type { ComputedRef, InjectionKey, MaybeRefOrGetter } from "vue";
import { computed, inject, provide, toValue } from "vue";
import type { NullableValue, OptionalValue, UpdateOptions, UpdateOptionsInjection } from "../types";
import { defaultTo } from "../utils";

export const UPDATE_OPTIONS_KEY: InjectionKey<UpdateOptionsInjection> = Symbol("UniEcharts.updateOptions");

export function provideEchartsUpdateOptions(value: UpdateOptionsInjection): void {
  provide(UPDATE_OPTIONS_KEY, value);
}

export function useEchartsUpdateOptions(value: MaybeRefOrGetter<OptionalValue<UpdateOptions>>): {
  injectUpdateOptions: ComputedRef<NullableValue<UpdateOptions>>;
  innerUpdateOptions: ComputedRef<UpdateOptions>;
} {
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