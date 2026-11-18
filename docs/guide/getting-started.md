# 快速开始

Uni ECharts 提供了 [npm](#npm-方式) 和 [uni-modules](#uni-modules-方式) 两种使用方式，任选其一即可。

::: tip uni-app x
如果你使用的是 uni-app x Vapor，请先阅读 [uni-app x 兼容版本](./uni-app-x)。
当前 `uni-echarts-x` 仍是实验版本 `0.0.0`，未发布 npm 或插件市场版本。
:::

::: info 前置条件

- NodeJS >= 20.19.0 || >= 22.12.0 || >= 24.0.0
- echarts >= 5.3.0
- vue >= 3.3.0（目前 uni-app 尚未适配 Vue 3.5，推荐使用 `3.4.x` 与 uni-app 保持一致）

:::

## NPM 方式 <Badge text="推荐" />

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

::: info 提示

如果需要使用定制 ECharts 请参考 [定制 ECharts](./echarts#定制-echarts) 部分的说明。

:::

### 配置

由于 Uni ECharts 发布到 npm 上的包是未经编译的 `vue` 文件，为了避免 Vite 对 Uni ECharts
[依赖预构建](https://cn.vitejs.dev/guide/dep-pre-bundling.html) 导致生成额外的 `echarts` 副本，
当使用 npm 方式时需要手动配置 Vite 强制排除 `uni-echarts` 的预构建。

::: info 提示

自 `2.5.0` 开始，配置 [Vite 插件](#vite-插件) 可以省略以下配置，插件内部将会自动添加排除。

:::

```js
// vite.config.js[ts]
import { defineConfig } from "vite";

export default defineConfig({
  // ...
  optimizeDeps: { // [!code ++]
    exclude: [ // [!code ++]
      "uni-echarts" // [!code ++]
    ] // [!code ++]
  } // [!code ++]
});
```

#### Vite 插件

自 `2.0.0` 开始，Uni ECharts 提供了 Vite 插件用于自动化处理一些繁琐、重复的工作，也为将来更多的高级功能提供了可能性。

```js
// vite.config.js[ts]
import { UniEcharts } from "uni-echarts/vite"; // [!code ++]
import { defineConfig } from "vite";

export default defineConfig({
  // ...
  plugins: [
    UniEcharts() // [!code ++]
  ]
});
```

#### 自动导入（可选）

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
import Uni from "@dcloudio/vite-plugin-uni";
import UniComponents from "@uni-helper/vite-plugin-uni-components";
import { UniEchartsResolver } from "uni-echarts/resolver"; // [!code ++]
import AutoImport from "unplugin-auto-import/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    AutoImport({
      resolvers: [
        UniEchartsResolver() // [!code ++]
      ]
    }),
    // 确保放在 `Uni()` 之前
    UniComponents({
      resolvers: [
        UniEchartsResolver() // [!code ++]
      ]
    }),
    Uni()
  ]
});
```

如果使用 PNPM 管理依赖，请在项目根目录下的 .npmrc 文件中添加如下内容，参见
[issue 389](https://github.com/unplugin/unplugin-vue-components/issues/389)。

```dotenv
shamefully-hoist=true
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

// 🚨 注意：必须调用 provideEcharts 才能正常运行
provideEcharts(echarts);
// 🤩 自 2.0.0 开始，通过配置 Vite 插件可以省略上述 provideEcharts 的调用

// 此处仅用于演示通过 provide 修改图表 theme 的方式，不是必须的
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

<style>
.chart {
  height: 300px;
}
</style>
```

::: details Options API 示例

```vue
<template>
  <uni-echarts custom-class="chart" :option="option"></uni-echarts>
</template>

<script>
import { PieChart } from "echarts/charts";
import { DatasetComponent, LegendComponent, TooltipComponent } from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import UniEcharts from "uni-echarts";
import { ECHARTS_KEY, THEME_KEY } from "uni-echarts/shared";
import { defineComponent } from "vue";

echarts.use([
  LegendComponent,
  TooltipComponent,
  DatasetComponent,
  PieChart,
  CanvasRenderer
]);

export default defineComponent({
  components: {
    UniEcharts
  },
  provide: {
    [ECHARTS_KEY]: echarts,
    [THEME_KEY]: "dark"
  },
  data() {
    return {
      option: {
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
      }
    };
  }
});
</script>

<style>
.chart {
  height: 300px;
}
</style>
```

:::

::: warning 小程序端图表不显示？

请参考常见问题中 [小程序端 class / style 无效](./faq#小程序端-class-style-无效) 部分的说明。

:::

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

    ::: info 提示

    如果需要使用定制 ECharts 请参考 [定制 ECharts](./echarts#定制-echarts) 部分的说明。

    :::

2. 前往 uni-app 插件市场下载 [Uni ECharts](https://ext.dcloud.net.cn/plugin?id=22035)

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
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { ref } from "vue";
// 🚨 注意导入路径与 npm 方式的区别
import { provideEcharts, provideEchartsTheme } from "@/uni_modules/xiaohe-echarts";

// 🚨 注意：自 2.0.0 开始，uni-modules 方式也必须调用 provideEcharts 才能正常运行
provideEcharts(echarts);

// 此处仅用于演示通过 provide 修改图表 theme 的方式，不是必须的
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

<style>
.chart {
  height: 300px;
}
</style>
```

::: details Options API 示例

```vue
<template>
  <uni-echarts custom-class="chart" :option="option"></uni-echarts>
</template>

<script>
import { PieChart } from "echarts/charts";
import { DatasetComponent, LegendComponent, TooltipComponent } from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { defineComponent } from "vue";
import { ECHARTS_KEY, THEME_KEY } from "@/uni_modules/xiaohe-echarts";

echarts.use([
  LegendComponent,
  TooltipComponent,
  DatasetComponent,
  PieChart,
  CanvasRenderer
]);

export default defineComponent({
  provide: {
    [ECHARTS_KEY]: echarts,
    [THEME_KEY]: "dark"
  },
  data() {
    return {
      option: {
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
      }
    };
  }
});
</script>

<style>
.chart {
  height: 300px;
}
</style>
```

:::

::: warning 小程序端图表不显示？

请参考常见问题中 [小程序端 class / style 无效](./faq#小程序端-class-style-无效) 部分的说明。

:::
