import { defineUniPages } from "@uni-helper/vite-plugin-uni-pages";

export default defineUniPages({
  easycom: {
    custom: {
      "^wd-(.*)": "wot-design-uni/components/wd-$1/wd-$1.vue"
    }
  },
  tabBar: {},
  globalStyle: {
    navigationBarTitleText: "Uni ECharts",
    navigationBarTextStyle: "black",
    navigationBarBackgroundColor: "#ffffff",
    "mp-weixin": {
      handleWebviewPreload: "auto"
    }
  }
});