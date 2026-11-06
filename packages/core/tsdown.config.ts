import { defineConfig } from "tsdown";

export default defineConfig([
  {
    name: "uni-echarts/dts",
    entry: "./src/index.d.ts",
    outDir: "dist",
    platform: "neutral",
    format: "esm",
    dts: {
      dtsInput: true,
      emitDtsOnly: true,
      tsc: {
        build: true
      }
    },
    deps: {
      neverBundle: [
        "echarts/core",
        "vue"
      ]
    }
  },
  {
    name: "uni-echarts/resolver",
    entry: "./resolver/index.ts",
    outDir: "dist-resolver",
    platform: "node",
    format: [
      "esm",
      "cjs"
    ],
    dts: {
      tsc: {
        build: true
      }
    },
    deps: {
      neverBundle: [
        "@uni-helper/vite-plugin-uni-components",
        "vite"
      ]
    }
  },
  {
    name: "uni-echarts/vite",
    entry: "./vite/index.ts",
    outDir: "dist-vite",
    platform: "node",
    format: [
      "esm",
      "cjs"
    ],
    dts: {
      tsc: {
        build: true
      }
    },
    deps: {
      neverBundle: [
        "vite",
        "vue"
      ]
    }
  }
]);