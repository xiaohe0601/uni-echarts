import { watch } from "vue";

export function useAutoresize(chart, {
  echarts,
  autoresize,
  root
}) {
  watch(
    [chart, autoresize, root],
    ([_chart, _autoresize, _root], _, onCleanup) => {
      let observer = null;

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