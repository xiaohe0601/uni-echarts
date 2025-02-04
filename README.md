<div align="center">
  <h1>uni-echarts</h1>
  <span>🪀 适用于uni-app的Apache ECharts组件（仅支持Vue 3）</span>
</div>

<br>

[![github stars][github-stars-src]][github-stars-href]
[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

xiaohe0601 / [github@xiaohe0601](https://github.com/xiaohe0601) / [gitee@xiaohe0601](https://gitee.com/xiaohe0601)

## 🎉 特性

- 🚀 快速上手，与 [vue-echarts](https://github.com/ecomfe/vue-echarts) 近乎一致的使用体验

- 📱 多端兼容，支持H5、小程序、APP

- 📦 支持 easycom

- ☕ 支持 TypeScript

- 🍳 支持免费商用

## 🚁 安装

uni-echarts 提供了 `npm` 和 `uni-modules` 两种使用方式，任选其一即可

### 版本要求

```json
{
  "echarts": ">=5.3.0",
  "vue": ">=3.3.0"
}
```

### npm 方式

```shell
# pnpm
pnpm add echarts uni-echarts

# yarn
yarn add echarts uni-echarts

# npm
npm install echarts uni-echarts
```

### uni-modules 方式

1. 使用 npm 安装 `echarts`

    ```shell
    # pnpm
    pnpm add echarts

    # yarn
    yarn add echarts

    # npm
    npm install echarts
    ```

2. 前往uni-app插件市场下载 [uni-echarts](https://ext.dcloud.net.cn/plugin?id=21996)

## 🛹 使用

### 简单示例

#### npm 方式

```vue
<template>
  <uni-echarts custom-class="chart" :option="option"></uni-echarts>
</template>

<script setup>
import { PieChart } from "echarts/charts";
import { DatasetComponent, LegendComponent, TooltipComponent } from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import UniEcharts from "uni-echarts";
import { provideEcharts, provideEchartsTheme } from "uni-echarts/shared";
import { ref } from "vue";

// 由于目前 uni-app 对于 npm 插件的编译机制问题
// 小程序端的 npm 插件内部无法正确获取到业务侧的 echarts
// 所以需要手动将 echarts 提供给插件用于构建图表
provideEcharts(echarts); // 🚨 注意：npm 方式需要添加这一行代码

// 此处仅用于演示通过 provide 修改图表 theme 的方式，不是必需
provideEchartsTheme("dark");

echarts.use([
  LegendComponent,
  TooltipComponent,
  DatasetComponent,
  PieChart,
  CanvasRenderer
]);

const option = ref({
  legend: {
    top: 10,
    left: "center"
  },
  tooltip: {
    trigger: "item",
    textStyle: {
      // #ifdef MP-WEIXIN
      // 临时解决微信小程序 tooltip 文字阴影问题
      textShadowBlur: 1
      // #endif
    }
  },
  series: [
    {
      type: "pie",
      radius: ["30%", "52%"],
      label: {
        show: false,
        position: "center"
      },
      itemStyle: {
        borderWidth: 2,
        borderColor: "#ffffff",
        borderRadius: 10
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 20
        }
      }
    }
  ],
  dataset: {
    dimensions: ["来源", "数量"],
    source: [
      ["Search Engine", 1048],
      ["Direct", 735],
      ["Email", 580],
      ["Union Ads", 484],
      ["Video Ads", 300]
    ]
  }
});
</script>

<style scoped>
.chart {
  height: 300px;
}
</style>
```

#### uni-modules 方式

uni-echarts 支持 `easycom` 规范，当使用 uni-modules 方式时无需导入即可直接使用组件

```vue
<template>
  <uni-echarts custom-class="chart" :option="option"></uni-echarts>
</template>

<script setup>
import { PieChart } from "echarts/charts";
import { DatasetComponent, LegendComponent, TooltipComponent } from "echarts/components";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { ref } from "vue";
// 🚨 注意导入路径与 npm 方式的区别
import { provideEchartsTheme } from "@/uni_modules/xiaohe01-echarts";

// 此处仅用于演示通过 provide 修改图表 theme 的方式，不是必需
provideEchartsTheme("dark");

use([
  LegendComponent,
  TooltipComponent,
  DatasetComponent,
  PieChart,
  CanvasRenderer
]);

const option = ref({
  legend: {
    top: 10,
    left: "center"
  },
  tooltip: {
    trigger: "item",
    textStyle: {
      // #ifdef MP-WEIXIN
      // 临时解决微信小程序 tooltip 文字阴影问题
      textShadowBlur: 1
      // #endif
    }
  },
  series: [
    {
      type: "pie",
      radius: ["30%", "52%"],
      label: {
        show: false,
        position: "center"
      },
      itemStyle: {
        borderWidth: 2,
        borderColor: "#ffffff",
        borderRadius: 10
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 20
        }
      }
    }
  ],
  dataset: {
    dimensions: ["来源", "数量"],
    source: [
      ["Search Engine", 1048],
      ["Direct", 735],
      ["Email", 580],
      ["Union Ads", 484],
      ["Video Ads", 300]
    ]
  }
});
</script>

<style scoped>
.chart {
  height: 300px;
}
</style>
```

> [!IMPORTANT]
> 由于小程序对于代码体积的要求非常严苛，所以我们鼓励手动从 `echarts` 中引入组件和图表，以减小打包体积。[vue-echarts](https://github.com/ecomfe/vue-echarts) 团队构建了一个[导入代码生成器](https://vue-echarts.dev/#codegen)，你只需要把 `option` 的代码粘贴进去，就可以得到精确的导入代码。
>
> ![](https://github.com/ecomfe/vue-echarts/assets/1726061/f9c38a06-3422-4f0e-ab8c-f242d9aea9aa)
>
> [试一试 →](https://vue-echarts.dev/#codegen)

但如果你实在需要全量引入 `echarts` 从而无需手动引入模块，只需要在代码中添加：

```ts
import "echarts";
```

### 属性

| 参数               | 说明                       | 类型              | 可选值         | 默认值     |
|------------------|--------------------------|-----------------|-------------|---------|
| custom-class     | 自定义 class                | any             | -           | -       |
| custom-style     | 自定义 style                | `StyleValue`    | -           | -       |
| option           | echarts option           | object          | -           | -       |
| option-key       | provide option key       | string          | -           | -       |
| theme            | echarts theme            | string / object | -           | -       |
| init-options     | echarts init opts        | object          | -           | -       |
| update-options   | echarts setOption opts   | object          | -           | -       |
| group            | echarts group            | string          | -           | -       |
| manual-update    | 是否手动更新 option            | boolean         | -           | `false` |
| `WEB` autoresize | 是否自动 resize（仅WEB端支持）     | `AutoResize`    | -           | `false` |
| loading          | 是否显示加载动画效果               | boolean         | -           | `false` |
| loading-options  | echarts showLoading opts | string          | -           | -       |
| canvas-type      | canvas type              | string          | 2d / legacy | 2d      |
| disable-scroll   | 触摸时是否禁用滚动                | boolean         | -           | `false` |
| support-hover    | PC 端是否支持 hover 行为        | boolean         | -           | `false` |
| init-delay       | 初始化延迟时间（单位：ms）           | number          | -           | `30`    |

#### 相关类型定义

```ts
type AutoResize = boolean | {
  throttle?: number;
  onResize?: () => void;
};
```

### 事件

可以使用 Vue 的 `v-on` 指令绑定事件

```vue
<template>
  <uni-echarts
    :option="option"
    @click="handleClick"
    @finished.once="handleFinished"
    @zr:click="handleZrClick"
    @native:tap="handleNativeTap"></uni-echarts>
</template>
```

> [!NOTE]
>
> 仅支持 `.once` 修饰符（并且小程序端不支持），因为其它修饰符都与 DOM 事件机制强耦合。

uni-echarts 支持如下事件：

- `highlight` [→](https://echarts.apache.org/zh/api.html#events.highlight)
- `downplay` [→](https://echarts.apache.org/zh/api.html#events.downplay)
- `selectchanged` [→](https://echarts.apache.org/zh/api.html#events.selectchanged)
- `legendselectchanged` [→](https://echarts.apache.org/zh/api.html#events.legendselectchanged)
- `legendselected` [→](https://echarts.apache.org/zh/api.html#events.legendselected)
- `legendunselected` [→](https://echarts.apache.org/zh/api.html#events.legendunselected)
- `legendselectall` [→](https://echarts.apache.org/zh/api.html#events.legendselectall)
- `legendinverseselect` [→](https://echarts.apache.org/zh/api.html#events.legendinverseselect)
- `legendscroll` [→](https://echarts.apache.org/zh/api.html#events.legendscroll)
- `datazoom` [→](https://echarts.apache.org/zh/api.html#events.datazoom)
- `datarangeselected` [→](https://echarts.apache.org/zh/api.html#events.datarangeselected)
- `timelinechanged` [→](https://echarts.apache.org/zh/api.html#events.timelinechanged)
- `timelineplaychanged` [→](https://echarts.apache.org/zh/api.html#events.timelineplaychanged)
- `restore` [→](https://echarts.apache.org/zh/api.html#events.restore)
- `dataviewchanged` [→](https://echarts.apache.org/zh/api.html#events.dataviewchanged)
- `magictypechanged` [→](https://echarts.apache.org/zh/api.html#events.magictypechanged)
- `geoselectchanged` [→](https://echarts.apache.org/zh/api.html#events.geoselectchanged)
- `geoselected` [→](https://echarts.apache.org/zh/api.html#events.geoselected)
- `geounselected` [→](https://echarts.apache.org/zh/api.html#events.geounselected)
- `axisareaselected` [→](https://echarts.apache.org/zh/api.html#events.axisareaselected)
- `brush` [→](https://echarts.apache.org/zh/api.html#events.brush)
- `brushEnd` [→](https://echarts.apache.org/zh/api.html#events.brushEnd)
- `brushselected` [→](https://echarts.apache.org/zh/api.html#events.brushselected)
- `globalcursortaken` [→](https://echarts.apache.org/zh/api.html#events.globalcursortaken)
- `rendered` [→](https://echarts.apache.org/zh/api.html#events.rendered)
- `finished` [→](https://echarts.apache.org/zh/api.html#events.finished)

- 鼠标事件
  - `click` [→](https://echarts.apache.org/zh/api.html#events.Mouse%20events.click)
  - `dblclick` [→](https://echarts.apache.org/zh/api.html#events.Mouse%20events.dblclick)
  - `mouseover` [→](https://echarts.apache.org/zh/api.html#events.Mouse%20events.mouseover)
  - `mouseout` [→](https://echarts.apache.org/zh/api.html#events.Mouse%20events.mouseout)
  - `mousemove` [→](https://echarts.apache.org/zh/api.html#events.Mouse%20events.mousemove)
  - `mousedown` [→](https://echarts.apache.org/zh/api.html#events.Mouse%20events.mousedown)
  - `mouseup` [→](https://echarts.apache.org/zh/api.html#events.Mouse%20events.mouseup)
  - `globalout` [→](https://echarts.apache.org/zh/api.html#events.Mouse%20events.globalout)
  - `contextmenu` [→](https://echarts.apache.org/zh/api.html#events.Mouse%20events.contextmenu)

- ZRender 事件
  - `zr:click`
  - `zr:mousedown`
  - `zr:mouseup`
  - `zr:mousewheel`
  - `zr:dblclick`
  - `zr:contextmenu`

请参考支持的事件列表。[前往 →](https://echarts.apache.org/zh/api.html#events)

### 原生 DOM 事件

由于 uni-echarts 默认将事件绑定到 `echarts` 实例，因此在使用原生 DOM 事件时需要做一些特殊处理，你需要在事件名称前加上 `native:` 前缀来绑定原生 DOM 事件。

```vue
<template>
  <!-- 注意，uni-app 中的原生 DOM 点击事件应该使用 tap 而不是 click -->
  <uni-echarts @native:tap="handleNativeTap"></uni-echarts>
</template>
```

### Provide / Inject

uni-echarts 为 `option`、 `theme`、`init-options`、`update-options` 和 `loading-options` 提供并导出了 provide 相关的 API，从而可以通过上下文的方式进行配置选项。

例如，可以通过如下方式来使用 provide API 为 `theme` 提供上下文配置：

```ts
import { provideEchartsTheme } from "uni-echarts/shared";

// 支持 字面量、ref、getter 等类型的值，组件内部通过 `toValue` 解析
provideEchartsTheme("dark");
```

另外，`option` 与其他选项略有不同，可以通过 `option-key` 选择控制某一个图表

```vue
<template>
  <!-- 注意，option-key 不是响应式，不支持动态修改 -->
  <uni-echarts option-key="chart1"></uni-echarts>

  <uni-echarts option-key="chart2"></uni-echarts>

  <uni-echarts></uni-echarts>
</template>

<script setup>
import { provideEchartsOption } from "uni-echarts/shared";
import { ref } from "vue";

const option = ref({
  // ...
});

// 此时，option 仅会影响 option-key 相同的图表
provideEchartsOption("chart1", option);
</script>
```

### 方法

- `setOption` [→](https://echarts.apache.org/zh/api.html#echartsInstance.setOption)
- `getWidth` [→](https://echarts.apache.org/zh/api.html#echartsInstance.getWidth)
- `getHeight` [→](https://echarts.apache.org/zh/api.html#echartsInstance.getHeight)
- `getDom` [→](https://echarts.apache.org/zh/api.html#echartsInstance.getDom)
- `getOption` [→](https://echarts.apache.org/zh/api.html#echartsInstance.getOption)
- `resize` [→](https://echarts.apache.org/zh/api.html#echartsInstance.resize)
- `dispatchAction` [→](https://echarts.apache.org/zh/api.html#echartsInstance.dispatchAction)
- `convertToPixel` [→](https://echarts.apache.org/zh/api.html#echartsInstance.convertToPixel)
- `convertFromPixel` [→](https://echarts.apache.org/zh/api.html#echartsInstance.convertFromPixel)
- `containPixel` [→](https://echarts.apache.org/zh/api.html#echartsInstance.containPixel)
- `showLoading` [→](https://echarts.apache.org/zh/api.html#echartsInstance.showLoading)
- `hideLoading` [→](https://echarts.apache.org/zh/api.html#echartsInstance.hideLoading)
- `getDataURL` [→](https://echarts.apache.org/zh/api.html#echartsInstance.getDataURL)
- `getConnectedDataURL` [→](https://echarts.apache.org/zh/api.html#echartsInstance.getConnectedDataURL)
- `clear` [→](https://echarts.apache.org/zh/api.html#echartsInstance.clear)
- `dispose` [→](https://echarts.apache.org/zh/api.html#echartsInstance.dispose)

- `toTempFilePath` [→](https://uniapp.dcloud.net.cn/api/canvas/canvasToTempFilePath.html) （无需传 `canvasId` 或 `canvas` 参数）

可以通过 `ref` 调用以上方法，例如：

```vue
<template>
  <uni-echarts ref="chartEl"></uni-echarts>
</template>

<script lang="ts" setup>
import type { UniEchartsInst } from "uni-echarts/shared";
import { ref } from "vue";

const chartEl = ref<UniEchartsInst | null>(null);

function download() {
  if (chartEl.value == null) {
    return;
  }

  chartEl.value.toTempFilePath();
}
</script>
```

### 静态方法

静态方法请直接通过 [echarts 本身](https://echarts.apache.org/zh/api.html#echarts) 进行调用

## 🍬 感谢

- [vue-echarts](https://github.com/ecomfe/vue-echarts)

- [lime-echart](https://gitee.com/liangei/lime-echart)

- [echarts-for-weixin](https://github.com/ecomfe/echarts-for-weixin)

- [mitt](https://github.com/developit/mitt)

## 🐶 讨论交流

- ❓：若有疑问或BUG反馈，可提交[issues](https://github.com/xiaohe0601/uni-echarts/issues)，也欢迎PR~
- 📫：[xiaohe0601@outlook.com](mailto:xiaohe0601@outlook.com)
- 🐧：暂未开通

## 🏆 开源协议

- MIT [LICENSE](./LICENSE)

## 🚓 声明

The Apache Software Foundation [Apache ECharts, ECharts](https://echarts.apache.org/), Apache, the Apache feather, and the Apache ECharts project logo are either registered trademarks or trademarks of the [Apache Software Foundation](https://www.apache.org/).

[github-stars-src]: https://img.shields.io/github/stars/xiaohe0601/uni-echarts?style=flat&colorA=080f12&colorB=1fa669&logo=GitHub

[github-stars-href]: https://github.com/xiaohe0601/uni-echarts

[npm-version-src]: https://img.shields.io/npm/v/uni-echarts?style=flat&colorA=080f12&colorB=1fa669

[npm-version-href]: https://npmjs.com/package/uni-echarts

[npm-downloads-src]: https://img.shields.io/npm/dm/uni-echarts?style=flat&colorA=080f12&colorB=1fa669

[npm-downloads-href]: https://npmjs.com/package/uni-echarts

[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669

[jsdocs-href]: https://www.jsdocs.io/package/uni-echarts

[license-src]: https://img.shields.io/github/license/xiaohe0601/uni-echarts.svg?style=flat&colorA=080f12&colorB=1fa669

[license-href]: https://github.com/xiaohe0601/uni-echarts/blob/main/LICENSE