import type { MaybeRefOrGetter, Reactive, Ref } from "vue";
import type { CanvasRect, EChartsType, GetTouchFuc } from "../components/uni-echarts/types";
import type { NullableValue } from "../types";
import type { VueThis } from "./useVueThis";

export declare function useEchartsTouch(options: {
  vueThis: VueThis;
  supportHover: MaybeRefOrGetter<boolean>;
  isPc: boolean;
  canvasId: string;
  chart: Ref<NullableValue<EChartsType>>;
  canvasRect: Reactive<CanvasRect>;
  getTouch: GetTouchFuc;
}): {
  onStart: (event: TouchEvent) => void;
  onMove: (event: TouchEvent) => void;
  onEnd: (event: TouchEvent) => void;
};