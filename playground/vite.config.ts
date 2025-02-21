import path from "node:path";
import process from "node:process";
import UniApp from "@dcloudio/vite-plugin-uni";
import UniComponents from "@uni-helper/vite-plugin-uni-components";
import { WotResolver } from "@uni-helper/vite-plugin-uni-components/resolvers";
import UniManifest from "@uni-helper/vite-plugin-uni-manifest";
import UniPages from "@uni-helper/vite-plugin-uni-pages";
import UnoCSS from "unocss/vite";
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
    UniManifest(),
    UniPages({
      dts: "types/uni-pages.d.ts"
    }),
    UniComponents({
      dts: "types/components.d.ts",
      dirs: [
        "src/components"
      ],
      directoryAsNamespace: true,
      collapseSamePrefixes: true,
      resolvers: [
        WotResolver()
      ]
    }),
    AutoImport({
      dts: "types/auto-imports.d.ts",
      dirs: [
        "src/composables",
        "src/utils"
      ],
      imports: [
        "vue",
        "uni-app",
        "pinia",
        "@vueuse/core"
      ]
    }),
    UnoCSS(),
    // @ts-expect-error whatever
    UniApp.default()
  ],
  build: {
    target: "es6",
    cssTarget: "chrome61"
  },
  optimizeDeps: {
    exclude: ["vue-demi"]
  }
});