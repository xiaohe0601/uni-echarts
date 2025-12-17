import { defineConfig } from "tsdown";

export default defineConfig({
  name: "uni-echarts/c2e",
  entry: [
    "./src/index.ts",
    "./src/cli.ts"
  ],
  platform: "node",
  format: [
    "esm",
    "cjs"
  ]
});