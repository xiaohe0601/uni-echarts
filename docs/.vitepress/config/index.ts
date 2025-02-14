import { defineConfig } from "vitepress";
import { shared } from "./shared.ts";
import { zh } from "./zh.ts";

export default defineConfig({
  ...shared,
  locales: {
    root: { label: "简体中文", ...zh }
  }
});