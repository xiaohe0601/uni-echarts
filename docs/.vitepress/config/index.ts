import { defineConfig } from "vitepress";
import llmstxt from "vitepress-plugin-llms";
import { shared } from "./shared";
import { zh } from "./zh";

export default defineConfig({
  ...shared,
  locales: {
    root: { label: "简体中文", ...zh }
  },
  vite: {
    plugins: [
      llmstxt()
    ]
  }
});