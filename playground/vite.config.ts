import path from "node:path";
import process from "node:process";
import Uni from "@dcloudio/vite-plugin-uni";
import UniComponents from "@uni-helper/vite-plugin-uni-components";
import UniManifest from "@uni-helper/vite-plugin-uni-manifest";
import UniPages from "@uni-helper/vite-plugin-uni-pages";
import UnoCSS from "unocss/vite";
import AutoImport from "unplugin-auto-import/vite";
import type { PluginOption } from "vite";
import { defineConfig } from "vite";
import UniPolyfill from "vite-plugin-uni-polyfill";

function r(...paths: string[]) {
  return path.resolve(process.cwd(), ".", ...paths);
}

function buildTransformAssetUrls() {
  return {
    tags: {
      "wd-img": ["src"]
    }
  };
}

function buildPlugins(): PluginOption[] {
  return [
    AutoImport({
      dts: "types/auto-imports.d.ts",
      imports: [
        "vue",
        "uni-app",
        "pinia",
        {
          "@vueuse/core": [
            "useEventBus"
          ]
        },
        {
          "wot-design-uni": [
            "useToast",
            "useNotify",
            "useMessage"
          ]
        }
      ],
      dirs: [
        "src/composables",
        "src/utils"
      ],
      vueTemplate: true
    }),
    UniComponents({
      dts: "types/components.d.ts",
      dirs: [
        "src/components"
      ],
      directoryAsNamespace: true,
      collapseSamePrefixes: true
    }),
    UniManifest(),
    UniPages({
      dts: "types/uni-pages.d.ts",
      dir: "src/pages",
      subPackages: [],
      exclude: [
        "**/components/**/*.*"
      ]
    }),
    UniPolyfill(),
    // @ts-expect-error uni doesn't support esm
    Uni.default({
      vueOptions: {
        template: {
          transformAssetUrls: buildTransformAssetUrls()
        }
      }
    }),
    UnoCSS()
  ];
}

export default defineConfig({
  root: process.cwd(),
  base: process.env.UNI_PLATFORM === "h5" ? "/ui/" : "/",
  resolve: {
    alias: {
      "@": r("src")
    }
  },
  plugins: buildPlugins(),
  build: {
    target: "es6",
    cssTarget: "chrome61"
  }
});