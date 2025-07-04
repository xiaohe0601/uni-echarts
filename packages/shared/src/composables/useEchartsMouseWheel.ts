import type { Ref } from "vue";
import { onBeforeUnmount, onMounted } from "vue";
import type { EChartsType, NullableValue } from "../types";
import { UniCanvas } from "../utils";
import type { GetTouchFuc } from "./useEchartsTouch";

export function useEchartsMouseWheel({
  isPc,
  chart,
  getTouch
}: {
  isPc: boolean;
  chart: Ref<NullableValue<EChartsType>>;
  getTouch: GetTouchFuc;
}): void {
  function mouseWheelHandler(event: WheelEvent) {
    if (chart.value == null) {
      return;
    }

    const { handler } = chart.value.getZr();
    UniCanvas.dispatch(handler, "mousewheel", getTouch(event));
  }

  onMounted(() => {
    if (isPc) {
      document.addEventListener("wheel", mouseWheelHandler);
    }
  });

  onBeforeUnmount(() => {
    if (isPc) {
      document.removeEventListener("wheel", mouseWheelHandler);
    }
  });
}