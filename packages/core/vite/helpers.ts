import type { SFCDescriptor } from "vue/compiler-sfc";
import { parse as VueParse } from "vue/compiler-sfc";

export async function parseVueSFC(code: string): Promise<SFCDescriptor> {
  try {
    return VueParse(code, { pad: "space" }).descriptor;

    // eslint-disable-next-line unused-imports/no-unused-vars
  } catch (error) {
    throw new Error("Vue's version must be 3.2.13 or higher.");
  }
}