import type { ComponentPublicInstance, MaybeRefOrGetter, Ref } from "vue";
import { watch } from "vue";
import type { EChartsType, NullableValue } from "../types";
import type { MinifyEcharts } from "./useEcharts";

export type AutoResize = boolean | {
  throttle?: number;
  onResize?: () => void;
};

export function useAutoresize(chart: Ref<NullableValue<EChartsType>>, {
  echarts,
  autoresize,
  root
}: {
  echarts: MinifyEcharts;
  autoresize: MaybeRefOrGetter<AutoResize>;
  root: Ref<NullableValue<ComponentPublicInstance>>;
}): void {
  watch(
    [chart, autoresize, root],
    (values, _, onCleanup) => {
      // not sure why, type inference is broken, temp type assertion
      const _chart = values[0] as NullableValue<EChartsType>;
      const _autoresize = values[1] as AutoResize;
      const _root = values[2] as NullableValue<ComponentPublicInstance>;

      let observer: NullableValue<ResizeObserver> = null;

      if (_chart != null && _root != null && _autoresize) {
        const { offsetWidth, offsetHeight } = _root.$el;

        const autoresizeOptions = _autoresize === true ? {} : _autoresize;
        const { throttle: wait = 100, onResize } = autoresizeOptions;

        let triggered = false;

        const callback = () => {
          _chart.resize({
            width: _root.$el.offsetWidth,
            height: _root.$el.offsetHeight
          });

          if (onResize != null) {
            onResize();
          }
        };

        const resizeCallback = wait ? echarts.throttle(callback, wait) : callback;

        observer = new ResizeObserver(() => {
          if (!triggered) {
            triggered = true;

            if (_root.$el.offsetWidth === offsetWidth && _root.$el.offsetHeight === offsetHeight) {
              return;
            }
          }

          // skip if container has zero size
          if (_root.$el.offsetWidth === 0 || _root.$el.offsetHeight === 0) {
            return;
          }

          resizeCallback();
        });

        observer.observe(_root.$el);
      }

      onCleanup(() => {
        if (observer == null) {
          return;
        }

        observer.disconnect();
        observer = null;
      });
    }
  );
}