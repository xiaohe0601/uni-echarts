import defineConfig from "@xiaohe01/eslint-config";

export default defineConfig({
  markdown: false,
  vue: {
    overrides: {
      "vue/custom-event-name-casing": "off"
    }
  },
  ignores: [
    "**/dist-resolver",
    "playground/src/uni_modules/**"
  ]
}, {
  files: ["docs/**/*.vue"],
  rules: {
    "vue/component-name-in-template-casing": ["error", "PascalCase"]
  }
});