import { MagicString } from "vue/compiler-sfc";
import type { ResolvedOptions } from "../options";

const ECHARTS_SUPPORTED_ENV = new Set(["web", "h5", "mp-weixin"]);

export async function transformZRender(code: string, options: ResolvedOptions) {
  if (!options.echarts.polyfill) {
    return null;
  }

  // eslint-disable-next-line node/prefer-global/process
  if (ECHARTS_SUPPORTED_ENV.has(process.env.UNI_PLATFORM!)) {
    return null;
  }

  const ms = new MagicString(code);

  if (options.echarts.polyfill) {
    polyfillZRender(code, ms);
  }

  return ms;
}

function polyfillZRender(code: string, ms: MagicString) {
  for (const item of code.matchAll(/\bwx\b/g)) {
    const start = item.index;
    const end = start + item[0].length;

    ms.update(start, end, "uni");
  }
}