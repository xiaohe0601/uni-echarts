import zrenderEnv from "zrender/lib/core/env";

const globalScope = globalThis as unknown as { global?: typeof globalThis };

if (typeof globalScope.global === "undefined") {
  globalScope.global = globalThis;
}

export function normalizeEChartsEnvironment(): void {
  const env = zrenderEnv as any;

  env.node = false;
  env.worker = false;
  env.wxa = false;
  env.domSupported = false;
  env.svgSupported = false;
  env.touchEventsSupported = true;
}