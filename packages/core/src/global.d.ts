declare module "vue" {
  export interface GlobalComponents {
    UniEcharts: typeof import("./components/uni-echarts/uni-echarts.vue")["default"];
  }
}

export {};