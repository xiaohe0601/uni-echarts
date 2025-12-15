import { defineConfig } from "@xiaohe01/stylelint-config";

export default defineConfig({
  core: {
    overrides: {
      "selector-class-pattern": null
    }
  },
  ignoreFiles: [
    "./**/node_modules/**",
    "./**/uni_modules/**",
    "./**/public/**",
    "./**/dist/**",
    "./docs/.vitepress/theme/style.css"
  ]
});