import type { ComponentResolver } from "@uni-helper/vite-plugin-uni-components";

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
  exclude?: RegExp;
}

export function UniEchartsResolver(options: UniEchartsResolverOptions = {}): ComponentResolver {
  return {
    type: "component",
    resolve(name) {
      if (options.exclude && name.match(options.exclude)) {
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