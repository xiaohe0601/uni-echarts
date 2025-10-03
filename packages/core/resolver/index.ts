import type { ComponentResolver } from "@uni-helper/vite-plugin-uni-components";
import type { FilterPattern } from "vite";
import { createFilter } from "vite";

const INDEX = "uni-echarts";
const SHARED = `${INDEX}/shared`;

const importsMap: Record<string, string> = {
  "UniEcharts": INDEX,
  "provideEcharts": SHARED,
  "provideEchartsTheme": SHARED,
  "provideEchartsOption": SHARED,
  "provideEchartsInitOptions": SHARED,
  "provideEchartsUpdateOptions": SHARED,
  "provideEchartsLoadingOptions": SHARED
};

export interface UniEchartsResolverOptions {
  exclude?: FilterPattern;
}

export function UniEchartsResolver(options: UniEchartsResolverOptions = {}): ComponentResolver {
  const filter = createFilter(undefined, options.exclude, { resolve: false });

  return {
    type: "component",
    resolve(name) {
      if (!filter(name)) {
        return;
      }

      const from = importsMap[name];

      if (from == null) {
        return;
      }

      return {
        name,
        from
      };
    }
  };
}