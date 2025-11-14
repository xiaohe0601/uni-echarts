import { MagicString } from "vue/compiler-sfc";
import { PLATFORM_API, SUPPORTED_ECHARTS_ENV } from "../constants";
import type { ResolvedOptions } from "../options";

export async function transformZRender(code: string, options: ResolvedOptions) {
  if (!options.echarts.polyfill) {
    return null;
  }

  // eslint-disable-next-line node/prefer-global/process
  const platform = process.env.UNI_PLATFORM!;

  if (SUPPORTED_ECHARTS_ENV.has(platform)) {
    return null;
  }

  const ms = new MagicString(code);

  if (options.echarts.polyfill) {
    polyfillZRender(code, ms, {
      platform
    });
  }

  return ms;
}

function polyfillZRender(code: string, ms: MagicString, options: {
  platform: string;
}) {
  for (const item of code.matchAll(/\bwx\b/g)) {
    const start = item.index;
    const end = start + item[0].length;

    ms.update(start, end, PLATFORM_API.get(options.platform) || "uni");
  }
}