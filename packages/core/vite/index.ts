import type { Plugin } from "vite";
import { createFilter } from "vite";
import type { MagicString } from "vue/compiler-sfc";
import type { Options } from "./options";
import { resolveOptions } from "./options";
import { transformComponent } from "./transform/component";

export type { Options } from "./options";

export function UniEcharts(options: Options = {}): Plugin {
  const opts = resolveOptions(options);

  const filter = createFilter(opts.include, opts.exclude);

  return {
    name: "uni-echarts",
    enforce: "pre",
    async transform(code, id) {
      let ms: MagicString | null = null;

      if (filter(id)) {
        ms = await transformComponent(code, opts);
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