import type { ComponentPublicInstance } from "vue";
import { getCurrentInstance } from "vue";

export type VueThis = ComponentPublicInstance;

export function useVueThis(): VueThis {
  const vm = getCurrentInstance();

  return vm!.proxy!;
}