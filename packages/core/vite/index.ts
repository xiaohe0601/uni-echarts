import type { Plugin } from "vite";
import { createFilter } from "vite";
import type { MagicString } from "vue/compiler-sfc";
import type { Options } from "./options";
import { resolveOptions } from "./options";
import { transformComponent } from "./transform/component";
import { transformZRender } from "./transform/zrender";

export type { Options } from "./options";

export function UniEcharts(options: Options = {}): Plugin {
  const opts = resolveOptions(options);

  const componentFilter = createFilter(opts.include, opts.exclude);

  const zrenderFilter = (id: string) => {
    // Web not handled, so Vite's optimizeDeps irrelevant. Match zrender file.
    return id.endsWith("zrender/lib/core/env.js");
  };

  return {
    name: "uni-echarts",
    enforce: "pre",
    async transform(code, id) {
      let ms: MagicString | null = null;

      if (componentFilter(id)) {
        ms = await transformComponent(code, opts);
      } else if (zrenderFilter(id)) {
        ms = await transformZRender(code, opts);
      }

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