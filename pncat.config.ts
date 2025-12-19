import { defineConfig, mergeCatalogRules } from "pncat";

export default defineConfig({
  catalogRules: mergeCatalogRules([
    {
      name: "dcloudio",
      match: [
        /^@dcloudio/
      ],
      priority: 1
    },
    {
      name: "dev",
      match: [
        "@vue/runtime-core"
      ],
      priority: 1
    },
    {
      name: "docs",
      match: [
        /\bvitepress\b/
      ],
      priority: 1
    },
    {
      name: "frontend",
      match: [
        "color"
      ],
      priority: 60
    },
    {
      name: "server",
      match: [
        "nitropack"
      ],
      priority: 1
    },
    {
      name: "xiaohe",
      match: [
        /^@xiaohe01/
      ],
      priority: 1
    },
    {
      name: "types",
      match: [
        /\btypes\b/,
        /\btypings\b/
      ],
      priority: 10
    },
    {
      name: "cli",
      match: [
        "@antfu/ni",
        "@uni-helper/unh",
        "minimist"
      ],
      priority: 20
    },
    {
      name: "build",
      match: [
        "@uni-helper/plugin-uni"
      ],
      priority: 40
    },
    {
      name: "utils",
      match: [
        "es-toolkit"
      ],
      priority: 60
    }
  ])
});