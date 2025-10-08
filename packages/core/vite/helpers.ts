import type { SFCDescriptor } from "vue/compiler-sfc";
import { parse as VueParse } from "vue/compiler-sfc";

export async function parseVueSFC(code: string): Promise<SFCDescriptor> {
  return VueParse(code, { pad: "space" }).descriptor;
}