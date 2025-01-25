import { getCurrentInstance } from "vue";

export function useVueThis() {
  const vm = getCurrentInstance();

  return vm.proxy;
}