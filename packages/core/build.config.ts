import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: [
    "src/index.js",
    "resolver/index.ts"
  ],
  clean: true,
  declaration: true,
  externals: [
    "@uni-helper/vite-plugin-uni-components",
    "echarts",
    "vue"
  ],
  failOnWarn: false
});