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
        "@antfu/ni"
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
      name: "node",
      match: [
        "minimist"
      ],
      priority: 60
    },
    {
      name: "utils",
      match: [
        "browser-fs-access",
        "es-toolkit",
        /\boxc\b/
      ],
      priority: 60
    }
  ])
});