import { defineConfig, mergeCatalogRules } from "pncat";

export default defineConfig({
  catalogRules: mergeCatalogRules([
    {
      name: "dcloudio",
      match: [
        /@dcloudio/
      ],
      priority: 60
    }
  ])
});