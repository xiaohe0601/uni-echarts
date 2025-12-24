import { onPageHide, onPageShow } from "@dcloudio/uni-app";
import { shallowRef } from "vue";

export function usePageVisible() {
  const visible = shallowRef(true);

  onPageShow(() => {
    visible.value = true;
  });

  onPageHide(() => {
    visible.value = false;
  });

  return {
    visible
  };
}