import { defineConfig, mergeCatalogRules } from "pncat";

export default defineConfig({
  catalogRules: mergeCatalogRules([
    {
      name: "build",
      match: [
        /^@rollup/,
        /^@uni-helper\/plugin-uni$/
      ],
      priority: 1
    },
    {
      name: "cli",
      match: [
        /^@antfu\/ni$/
      ],
      priority: 1
    },
    {
      name: "dcloudio",
      match: [
        /^@dcloudio/
      ],
      priority: 0
    },
    {
      name: "dev",
      match: [
        /^@vue\/runtime-core$/
      ],
      priority: 0
    },
    {
      name: "docs",
      match: [
        /\bvitepress\b/
      ],
      priority: 0
    },
    {
      name: "node",
      match: [
        /^minimist$/
      ],
      priority: 1
    },
    {
      name: "server",
      match: [
        /^nitropack$/
      ],
      priority: 1
    },
    {
      name: "test",
      match: [
        /\bvitest\b/
      ],
      priority: 1
    },
    {
      name: "types",
      match: [
        /\btypes\b/,
        /\btypings\b/
      ],
      priority: 1
    },
    {
      name: "utils",
      match: [
        /^browser-fs-access$/,
        /^es-toolkit$/,
        /\boxc\b/
      ],
      priority: 1
    },
    {
      name: "xiaohe",
      match: [
        /^@xiaohe01/
      ],
      priority: 1
    }
  ])
});