import defineConfig from "@xiaohe01/eslint-config";

export default defineConfig({
  pnpm: true,
  vue: {
    overrides: {
      "vue/custom-event-name-casing": "off"
    }
  },
  ignores: [
    "**/*.md",
    "**/dist-resolver",
    "playground/src/uni_modules"
  ]
}, {
  files: ["docs/**/*.vue"],
  rules: {
    "vue/component-name-in-template-casing": ["error", "PascalCase"]
  }
});