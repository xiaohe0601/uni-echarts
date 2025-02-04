import path from "node:path";
import process from "node:process";
import UniApp from "@dcloudio/vite-plugin-uni";
import UniComponents from "@uni-helper/vite-plugin-uni-components";
import { UniEchartsResolver } from "uni-echarts/resolver";
import AutoImport from "unplugin-auto-import/vite";
import { defineConfig } from "vite";

function r(...paths: string[]) {
  return path.resolve(process.cwd(), ".", ...paths);
}

export default defineConfig({
  root: process.cwd(),
  resolve: {
    alias: {
      "@": r("src")
    }
  },
  plugins: [
    UniComponents({
      dts: "types/components.d.ts",
      dirs: [
        "src/components"
      ],
      directoryAsNamespace: true,
      collapseSamePrefixes: true,
      resolvers: [
        UniEchartsResolver()
      ]
    }),
    AutoImport({
      dts: "types/auto-imports.d.ts",
      imports: [
        "vue",
        "uni-app",
        "pinia"
      ],
      resolvers: [
        UniEchartsResolver()
      ]
    }),
    // @ts-expect-error whatever
    UniApp.default()
  ]
});