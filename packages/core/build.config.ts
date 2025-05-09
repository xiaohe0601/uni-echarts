import { defineBuildConfig } from "unbuild";

export default defineBuildConfig([
  {
    name: "uni-echarts",
    entries: [
      "src/index.js"
    ],
    outDir: "dist",
    clean: false,
    declaration: true,
    externals: [
      "echarts",
      "vue"
    ],
    failOnWarn: false
  },
  {
    name: "uni-echarts/resolver",
    entries: [
      "resolver/index.ts"
    ],
    outDir: "dist-resolver",
    clean: false,
    declaration: true,
    externals: [
      "@uni-helper/vite-plugin-uni-components"
    ],
    failOnWarn: false,
    rollup: {
      emitCJS: true
    }
  }
]);