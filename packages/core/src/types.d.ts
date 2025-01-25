import type { MaybeRefOrGetter, StyleValue } from "vue";

export type OptionalValue<T> = T | undefined;
export type NullableValue<T> = T | null;

export interface AllowedComponentProps {
  class?: any;
  style?: StyleValue;
}

export type Injection<T> = MaybeRefOrGetter<NullableValue<T>>;