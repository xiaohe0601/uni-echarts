import type { ComputedRef, InjectionKey, MaybeRefOrGetter } from "vue";
import type { UpdateOptions, UpdateOptionsInjection } from "../components/uni-echarts/types";
import type { NullableValue, OptionalValue } from "../types";

export declare const UPDATE_OPTIONS_KEY: InjectionKey<UpdateOptionsInjection>;

export declare function provideEchartsUpdateOptions(value: UpdateOptionsInjection): void;

export declare function useEchartsUpdateOptions(value: MaybeRefOrGetter<OptionalValue<UpdateOptions>>): {
  injectUpdateOptions: ComputedRef<NullableValue<UpdateOptions>>;
  innerUpdateOptions: ComputedRef<UpdateOptions>;
};