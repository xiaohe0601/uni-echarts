import { defineConfig } from "@xiaohe01/eslint-config";

export default defineConfig({
  pnpm: true,
  ignores: [
    "**/*.min.js",
    "packages/core/src/shared-core.*",
    "packages/core/dist-resolver",
    "packages/core/dist-vite",
    "packages/server/.nitro",
    "playground/src/uni_modules"
  ]
}, {
  files: ["docs/**/*.vue"],
  rules: {
    "vue/component-name-in-template-casing": ["error", "PascalCase"]
  }
});