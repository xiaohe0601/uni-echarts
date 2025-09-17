import { MagicString } from "vue/compiler-sfc";
import { parseVueSFC } from "./helpers";

export interface TransformOptions {
  provideECharts?: boolean | string;
}

export async function transform(code: string, options: TransformOptions) {
  const {
    provideECharts = true
  } = options;

  if (!provideECharts) {
    return null;
  }

  const ms = new MagicString(code);

  if (provideECharts) {
    await injectEChartsProvide(
      code,
      ms,
      provideECharts === true ? "echarts/core" : provideECharts
    );
  }

  return ms;
}

async function injectEChartsProvide(
  code: string,
  ms: MagicString,
  echarts: string
) {
  const sfc = await parseVueSFC(code);

  if (sfc.template == null) {
    return;
  }

  const templateContent = sfc.template.content;

  if (!/<(?:UniEcharts|uni-echarts)/.test(templateContent)) {
    return;
  }

  if (sfc.scriptSetup != null) {
    const { content, loc } = sfc.scriptSetup;

    const hasImportEcharts = /import\s+\*\s+as\s+echarts\s+from\s+["']echarts(?:\/core)?["']/.test(content);
    const hasImportProvide = /import\s*\{[^}]*\bprovideEcharts\b[^}]*\}\s*from\s*["']uni-echarts\/shared["']/.test(content);
    const hasProvideCall = /provideEcharts\s*\(\s*echarts\s*\)/.test(content);

    const prependImports: string[] = [];

    if (!hasImportEcharts) {
      prependImports.push(`import * as echarts from "${echarts}";`);
    }
    if (!hasImportProvide) {
      prependImports.push(`import { provideEcharts } from "uni-echarts/shared";`);
    }

    if (prependImports.length > 0) {
      ms.appendLeft(loc.start.offset, `\n${prependImports.join("\n")}`);
    }

    if (!hasProvideCall) {
      ms.appendLeft(loc.end.offset, `provideEcharts(echarts);\n`);
    }
  } else if (sfc.script != null) {
    const { content, loc } = sfc.script;

    const hasImportEcharts = /import\s+\*\s+as\s+echarts\s+from\s+["']echarts(?:\/core)?["']/.test(content);
    const hasImportProvideKey = /import\s*\{[^}]*\bECHARTS_KEY\b[^}]*\}\s*from\s*["']uni-echarts\/shared["']/.test(content);

    const prependImports: string[] = [];
    if (!hasImportEcharts) {
      prependImports.push(`import * as echarts from "${echarts}";`);
    }
    if (!hasImportProvideKey) {
      prependImports.push(`import { ECHARTS_KEY } from "uni-echarts/shared";`);
    }

    if (prependImports.length > 0) {
      ms.appendLeft(loc.start.offset, `\n${prependImports.join("\n")}`);
    }

    const exportDefaultRegex = /export\s+default\s*(?:defineComponent\s*)?\(\s*(\{[\s\S]*?\})\s*\)/;
    const exportDefaultMatch = exportDefaultRegex.exec(content);

    if (exportDefaultMatch != null) {
      const defaultContent = exportDefaultMatch[1];

      const provideMatch = /(?:^|,)\s*provide\s*:\s*\{([\s\S]*?)\}/m.exec(defaultContent);

      const hasEchartsProvide = provideMatch != null
        ? /\[?\s*ECHARTS_KEY\s*(?:\]\s*)?:\s*echarts/.test(provideMatch[1])
        : false;

      if (!hasEchartsProvide) {
        if (provideMatch != null) {
          const insertPos = loc.start.offset + exportDefaultMatch.index + provideMatch.index + provideMatch[0].length;

          ms.appendLeft(insertPos, `\n    [ECHARTS_KEY]: echarts,`);
        } else {
          const insertPos = loc.start.offset + exportDefaultMatch.index + exportDefaultMatch[0].length;

          ms.appendLeft(insertPos, `\n  provide: { [ECHARTS_KEY]: echarts },`);
        }
      }
    }
  }
}