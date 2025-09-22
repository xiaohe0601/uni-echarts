# 关于 ECharts

一些 echarts 相关的说明。

## 按需导入

由于小程序对于代码体积的要求非常严苛，所以我们鼓励手动从 `echarts` 中按需导入组件和图表，以减小打包体积。
[Vue ECharts](https://github.com/ecomfe/vue-echarts) 团队构建了一个 [导入代码生成器](https://vue-echarts.dev/#codegen)，
你只需要把 `option` 的代码粘贴进去，就可以得到精确的导入代码。[试一试](https://vue-echarts.dev/#codegen)

![](https://github.com/ecomfe/vue-echarts/assets/1726061/f9c38a06-3422-4f0e-ab8c-f242d9aea9aa)

但如果你实在需要全量引入 `echarts` 从而无需手动导入模块，只需要在代码中添加：

```js
import "echarts";
```

## 定制 ECharts

通常情况，使用 [按需导入](#按需导入) 就能有效减小打包体积，但是在某些场景如果需要使用定制的 ECharts，
在 Uni ECharts 中可以配合 [provideEcharts](../apis/function#provideecharts) 实现。

首先到 ECharts 官网 [在线定制](https://echarts.apache.org/zh/builder.html) 并打包下载 `echarts` 到项目中
（建议放到主包或分包的 `static` 目录下），然后参考下述方案实现。

### NPM 方式

自 `2.0.0` 开始，npm 方式可以通过修改 Vite 插件配置轻松实现。

```js
// vite.config.js[ts]
import { UniEcharts } from "uni-echarts/vite";
import { defineConfig } from "vite";

export default defineConfig({
  // ...
  plugins: [
    UniEcharts({
      // 传实际的 echarts 路径，例如："@/static/echarts.min.js"
      provideECharts: "/path/to/echarts.min.js" // [!code ++]
    })
  ]
});
```

当然，也可以手动调用，示例如下：

```js
import * as echarts from "echarts/core";// [!code --]
import { provideEcharts } from "uni-echarts/shared";
import * as echarts from "/path/to/echarts.min.js";// [!code ++]

provideEcharts(echarts);
```

### Uni Modules 方式

使用 uni-modules 方式需要手动调用，示例如下：

```js
import * as echarts from "echarts/core";// [!code --]
import { provideEcharts } from "@/uni_modules/xiaohe-echarts";
import * as echarts from "/path/to/echarts.min.js";// [!code ++]

provideEcharts(echarts);
```