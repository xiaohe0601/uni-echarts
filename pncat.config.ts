import { defineConfig, mergeCatalogRules } from "pncat";

export default defineConfig({
  catalogRules: mergeCatalogRules([
    {
      name: "dcloudio",
      match: [
        /@dcloudio/
      ],
      priority: 0
    },
    {
      name: "utils",
      match: [
        /oxc/
      ],
      priority: 0
    }
  ])
});