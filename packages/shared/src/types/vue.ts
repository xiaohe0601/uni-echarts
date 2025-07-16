import type { MaybeRefOrGetter, StyleValue } from "vue";
import type { NullableValue } from "./helpers";

export interface AllowedComponentProps {
  class?: any;
  style?: StyleValue;
}

export type Injection<T> = MaybeRefOrGetter<NullableValue<T>>;