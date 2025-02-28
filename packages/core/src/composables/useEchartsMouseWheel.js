import { onBeforeUnmount, onMounted } from "vue";
import { UniCanvas } from "../utils/canvas";

export function useEchartsMouseWheel({
  isPc,
  chart,
  getTouch
}) {
  function mouseWheelHandler(event) {
    if (chart.value == null) {
      return;
    }

    const { handler } = chart.value.getZr();
    UniCanvas.dispatch(handler, "mousewheel", getTouch(event));
  }

  onMounted(() => {
    if (isPc) {
      document.addEventListener("mousewheel", mouseWheelHandler);
    }
  });

  onBeforeUnmount(() => {
    if (isPc) {
      document.removeEventListener("mousewheel", mouseWheelHandler);
    }
  });
}