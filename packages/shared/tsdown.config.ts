import keepComments from "@uni-ku/unplugin-keep-comments/rolldown";
import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "./src/index.ts",
  platform: "neutral",
  format: "esm",
  dts: {
    build: true
  },
  external: [
    "echarts",
    "vue"
  ],
  plugins: [
    keepComments({
      comments: [
        /^\/\/ *#if/,
        /^\/\/ *#endif/
      ]
    })
  ]
});