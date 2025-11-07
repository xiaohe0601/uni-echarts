import type { ResolvedOptions } from "../options";

export async function transformComponent(code: string, options: ResolvedOptions) {
  // ...

  console.warn(code, options);
}