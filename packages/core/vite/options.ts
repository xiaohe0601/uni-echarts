import type { FilterPattern } from "vite";

export type ImportType = "default" | "namespace";

export interface TransformOptions {
  echarts?: {
    provide?: boolean | string;
    importType?: ImportType;
    polyfill?: boolean;
  };
}

export interface Options extends TransformOptions {
  include?: FilterPattern;
  exclude?: FilterPattern;
}

export function resolveOptions(options: Options) {
  const { echarts, ...opts } = options;

  return {
    echarts: {
      provide: true,
      importType: "namespace",
      polyfill: true,
      ...echarts
    },
    include: "./src/**/*.vue",
    exclude: undefined,
    ...opts
  } satisfies Options;
}

export type ResolvedOptions = ReturnType<typeof resolveOptions>;