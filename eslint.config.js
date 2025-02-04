import defineConfig from "@xiaohe01/eslint-config";

export default defineConfig({
  markdown: false,
  vue: {
    overrides: {
      "vue/custom-event-name-casing": "off"
    }
  },
  ignores: [
    "**/dist-resolver"
  ]
});