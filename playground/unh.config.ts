import { defineConfig } from "@uni-helper/unh";

export default defineConfig({
  env: {
    dts: false
  },
  autoGenerate: {
    pages: true,
    manifest: true
  },
  devtools: {
    open: true
  }
});