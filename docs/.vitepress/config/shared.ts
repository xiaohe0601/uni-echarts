import { defineConfig } from "vitepress";
import { search as zhSearch } from "./zh";

export const shared = defineConfig({
  head: [
    ["link", {
      rel: "icon",
      type: "image/png",
      href: "https://oss.xiaohe.ink/images/uni-echarts.png"
    }],
    ["script", {
      defer: "",
      src: "https://cloud.umami.is/script.js",
      "data-website-id": "28a6dd1a-4935-4608-9e8f-c08bbfcac563"
    }]
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