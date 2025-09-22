# 从 1.x 迁移到 2.x

本章介绍了 Uni ECharts 从 1.x 迁移到 2.x 有哪些新增特性以及破坏性变更。

## NPM 方式

### 新增特性

- Vite 插件

  自 `2.0.0` 开始，Uni ECharts 在 npm 版本中提供了一个 Vite 插件用于自动化处理一些繁琐、重复的工作。
  由于插件可以自动完成 `provideEcharts` 的调用，所以组件内部将不再填充 `echarts/core` 作为默认的 `echarts` 插件，
  同时也间接支持了定制 `echarts` 的使用（还解决了小程序端 `echarts/core` 生成重复问题，进一步节省了小程序宝贵的空间）。

## Uni Modules 方式

### 破坏性变更

- 需要手动调用 provideEcharts 方法

  自 `2.0.0` 开始，为了支持定制 `echarts` 的使用，组件将不再自动填充 `echarts/core` 作为默认的 `echarts` 插件，
  所以必须要手动调用 `provideEcharts`，示例如下：

  ```js
  import * as echarts from "echarts/core";
  import { provideEcharts } from "@/uni_modules/xiaohe-echarts";

  provideEcharts(echarts);
  ```

  ::: details Options API 示例

  ```js
  import * as echarts from "echarts/core";
  import { defineComponent } from "vue";
  import { ECHARTS_KEY } from "@/uni_modules/xiaohe-echarts";

  export default defineComponent({
    provide: {
      [ECHARTS_KEY]: echarts
    }
  });
  ```
  :::