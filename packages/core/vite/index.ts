import type { FilterPattern, Plugin } from "vite";
import { createFilter } from "vite";
import type { TransformOptions } from "./transform";
import { transform } from "./transform";

export interface Options extends TransformOptions {
  include?: FilterPattern;
  exclude?: FilterPattern;
}

export function UniEcharts(options: Options = {}): Plugin {
  const opts = {
    provideECharts: true,
    include: "./src/**/*.vue",
    ...options
  };

  const filter = createFilter(opts.include, opts.exclude);

  return {
    name: "uni-echarts",
    enforce: "pre",
    async transform(code, id) {
      if (!filter(id)) {
        return;
      }

      const ms = await transform(code, opts);

      if (ms == null || !ms.hasChanged()) {
        return;
      }

      return {
        code: ms.toString(),
        map: ms.generateMap({
          hires: true
        })
      };
    }
  };
}