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
  },
  {
    name: "uni-echarts/vite",
    entries: [
      "vite/index.ts"
    ],
    outDir: "dist-vite",
    clean: false,
    declaration: true,
    externals: [
      "@vue/compiler-sfc",
      "vite"
    ],
    failOnWarn: false,
    rollup: {
      emitCJS: true
    }
  }
]);