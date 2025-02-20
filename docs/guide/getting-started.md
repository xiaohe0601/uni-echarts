# 快速开始

Uni ECharts 提供了 [npm](#npm-方式) 和 [uni-modules](#uni-modules-方式) 两种使用方式，任选其一即可。

::: info 前置条件

- **echarts** >=5.3.0
- **vue** >=3.3.0

:::

## NPM 方式

::: warning 注意

由于 uni-app 编译机制问题，目前 npm 方式尚存在如下已知缺陷待解决：

- WEB 端调用 [registerTheme](https://echarts.apache.org/zh/api.html#echarts.registerTheme) 等 echarts 的 API 无效
- WEB 端不支持 [依赖注入](./provide) 方式使用组件
- echarts 的 Tree-Shaking 失效，导致代码体积过大

---

推荐使用 [uni-modules](#uni-modules-方式) 方式，待上诉缺陷解决后再考虑使用 npm 方式。

:::

### 安装

::: code-group

```shell [pnpm]
pnpm add echarts uni-echarts
```

```shell [yarn]
yarn add echarts uni-echarts
```

```shell [npm]
npm install echarts uni-echarts
```

:::

### 配置

Uni ECharts 可以配合 [@uni-helper/vite-plugin-uni-components](https://github.com/uni-helper/vite-plugin-uni-components)
和 [unplugin-auto-import](https://github.com/unplugin/unplugin-auto-import) 实现组件和 API 的自动按需导入。

::: code-group

```shell [pnpm]
pnpm add -D @uni-helper/vite-plugin-uni-components unplugin-auto-import
```

```shell [yarn]
yarn add --dev @uni-helper/vite-plugin-uni-components unplugin-auto-import
```

```shell [npm]
npm install -D @uni-helper/vite-plugin-uni-components unplugin-auto-import
```

:::

```js
// vite.config.js[ts]
import UniApp from "@dcloudio/vite-plugin-uni";
import UniComponents from "@uni-helper/vite-plugin-uni-components";
import { UniEchartsResolver } from "uni-echarts/resolver";
import AutoImport from "unplugin-auto-import/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    // 确保放在 `UniApp()` 之前
    UniComponents({
      resolvers: [
        UniEchartsResolver() // [!code ++]
      ]
    }),
    AutoImport({
      resolvers: [
        UniEchartsResolver() // [!code ++]
      ]
    }),
    UniApp()
  ]
});
```

如果使用 pnpm 管理依赖，请在项目根目录下的 .npmrc 文件中添加如下内容，参见
[issue 389](https://github.com/unplugin/unplugin-vue-components/issues/389)。

```dotenv
shamefully-hoist=true # or public-hoist-pattern[]=@vue*
```

如果使用 TypeScript 可以在 tsconfig.json 中添加如下内容为自动导入的组件提供类型提示（需要
[IDE 支持](https://cn.vuejs.org/guide/typescript/overview#ide-support)）。

```json5
{
  "compilerOptions": {
    "types": [
      // ...
      "uni-echarts/global" // [!code ++]
    ]
  }
}
```

### 使用

```vue
<template>
  <uni-echarts custom-class="chart" :option="option"></uni-echarts>
</template>

<script setup>
import { PieChart } from "echarts/charts";
import { DatasetComponent, LegendComponent, TooltipComponent } from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import UniEcharts from "uni-echarts"; // [!code --]
import { provideEcharts, provideEchartsTheme } from "uni-echarts/shared"; // [!code --]
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

## Uni Modules 方式

### 安装

1. 使用 npm 安装 `echarts`

::: code-group

```shell [pnpm]
pnpm add echarts
```

```shell [yarn]
yarn add echarts
```

```shell [npm]
npm install echarts
```

:::

2. 前往 uni-app 插件市场下载 [uni-echarts](https://ext.dcloud.net.cn/plugin?id=22035)

### 配置

::: tip 提示

Uni ECharts 支持 [easycom](https://uniapp.dcloud.net.cn/component/#easycom) 规范，
当使用 uni-modules 方式时无需配置即可免导入直接使用组件。

:::

::: warning 注意

但是组件提供的 API 仍需手动导入，并且需要注意导入路径与 npm 方式的区别。

:::

### 使用

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
import { provideEchartsTheme } from "@/uni_modules/xiaohe-echarts";

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