declare module "vue" {
  import type { AttributifyAttributes } from "@unocss/preset-attributify";

  interface HTMLAttributes extends AttributifyAttributes {}
}

export {};