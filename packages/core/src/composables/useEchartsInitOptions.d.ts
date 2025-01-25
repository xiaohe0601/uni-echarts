import type { ComputedRef, InjectionKey, MaybeRefOrGetter } from "vue";
import type { InitOptions, InitOptionsInjection } from "../components/uni-echarts/types";
import type { NullableValue, OptionalValue } from "../types";

export declare const INIT_OPTIONS_KEY: InjectionKey<InitOptionsInjection>;

export declare function provideEchartsInitOptions(value: InitOptionsInjection): void;

export declare function useEchartsInitOptions(value: MaybeRefOrGetter<OptionalValue<InitOptions>>): {
  injectInitOptions: ComputedRef<NullableValue<InitOptions>>;
  innerInitOptions: ComputedRef<InitOptions>;
};