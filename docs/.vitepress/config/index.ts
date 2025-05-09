import { defineConfig } from "vitepress";
import { groupIconMdPlugin as GroupIconMd, groupIconVitePlugin as GroupIconVite } from "vitepress-plugin-group-icons";
import LlmsTxt from "vitepress-plugin-llms";
import { shared } from "./shared";
import { zh } from "./zh";

export default defineConfig({
  ...shared,
  locales: {
    root: { label: "简体中文", ...zh }
  },
  markdown: {
    config(md) {
      md.use(GroupIconMd);
    }
  },
  vite: {
    plugins: [
      GroupIconVite(),
      LlmsTxt()
    ]
  }
});