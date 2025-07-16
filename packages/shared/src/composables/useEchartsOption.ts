import type { ComputedRef, MaybeRefOrGetter } from "vue";
import { computed, inject, provide, toValue } from "vue";
import type { ChartOption, ChartOptionInjection, NullableValue, OptionalValue } from "../types";
import { defaultTo, isEmpty } from "../utils";

export const OPTION_KEY = "UniEcharts.option";

export function getEchartsOptionKey(key?: string): string {
  if (isEmpty(key)) {
    return OPTION_KEY;
  }

  return `${OPTION_KEY}_${key}`;
}

export function provideEchartsOption(value: ChartOptionInjection): void;
export function provideEchartsOption(key: string, value: ChartOptionInjection): void;
export function provideEchartsOption(keyOrValue: string | ChartOptionInjection, value?: ChartOptionInjection): void {
  if (typeof keyOrValue === "string") {
    provide(getEchartsOptionKey(keyOrValue), value);
    return;
  }

  provide(getEchartsOptionKey(), keyOrValue);
}

export function useEchartsOption(key: OptionalValue<string>, value: MaybeRefOrGetter<OptionalValue<ChartOption>>): {
  injectOption: ComputedRef<NullableValue<ChartOption>>;
  innerOption: ComputedRef<NullableValue<ChartOption>>;
} {
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