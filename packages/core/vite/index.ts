import type { FilterPattern, Plugin } from "vite";
import { createFilter } from "vite";
import { transform } from "./transform";

export interface Options {
  provideECharts?: boolean;
  include?: FilterPattern;
  exclude?: FilterPattern;
}

export function UniEcharts(options: Options = {}): Plugin {
  const {
    provideECharts = true,
    include = "./src/**/*.vue"
  } = options;

  const filter = createFilter(include, options.exclude);

  return {
    name: "uni-echarts",
    enforce: "pre",
    async transform(code, id) {
      if (!filter(id)) {
        return null;
      }

      const ms = await transform(code, {
        provideECharts
      });

      if (!ms.hasChanged()) {
        return null;
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