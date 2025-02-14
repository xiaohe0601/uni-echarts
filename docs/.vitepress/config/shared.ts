import { defineConfig } from "vitepress";
import { search as zhSearch } from "./zh.ts";

export const shared = defineConfig({
  head: [
    ["link", { rel: "icon", type: "image/png", href: "https://oss.xiaohe.ink/images/uni-echarts.png" }]
  ],
  cleanUrls: true,
  metaChunk: true,
  lastUpdated: true,
  themeConfig: {
    logo: "https://oss.xiaohe.ink/images/uni-echarts.png",
    search: {
      provider: "local",
      options: {
        locales: {
          ...zhSearch
        }
      }
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/xiaohe0601/uni-echarts" }
    ],
    externalLinkIcon: true
  }
});