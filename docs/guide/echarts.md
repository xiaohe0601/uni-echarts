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
在 Uni ECharts 中可以配合 [provideEcharts](../apis/function#provideecharts) 实现，具体参考以下步骤：

1. 使用 ECharts 官网的 [在线定制](https://echarts.apache.org/zh/builder.html)
   功能根据需求选择需要使用的模块构建并下载 `echarts.min.js` 到本地；

2. 由于 Vite 默认仅支持 ESM 模块，但是 ECharts 官网的在线定制功能并不支持下载 ESM 格式的产物，
   所以 Uni ECharts 提供了一个 CLI 工具可以轻松将其转换为 ESM 格式，使用示例如下：

   ::: code-group

    ```shell [pnpm]
    pnpm dlx @uni-echarts/c2e uni-echarts-c2e ./echarts.min.js ./echarts.esm.js
    ```

    ```shell [npm]
    npx @uni-echarts/c2e uni-echarts-c2e ./echarts.min.js ./echarts.esm.js
    ```

   :::

    ```shell
    ┌  Uni ECharts Transform CLI
    │
    ●  Transform input echarts.min.js to ESM
    │
    ◇  Input file
    │  ./echarts.min.js
    │
    ◇  Output file
    │  ./echarts.esm.js
    │
    ◇  Transform completed!
    │
    └  Output: /path/to/echarts.esm.js
    ```

   ::: warning 提示

   受限于 `echarts.min.js` 的内容，转换后的 ESM 产物并不支持 Tree-Shaking，并且需要使用默认导入，示例如下：

   ```javascript
   import echarts from "/path/to/echarts.esm.js";
   ```

   :::

3. 将转换后的 `echarts.esm.js` 放入项目中，注意**不要**放到 `static` 目录。

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
      echarts: { // [!code ++]
        // 传实际的 echarts 文件路径，例如："@/plugins/echarts.esm.js" // [!code ++]
        provide: "/path/to/echarts.esm.js", // [!code ++]
        importType: "default" // [!code ++]
      } // [!code ++]
    })
  ]
});
```

当然，也可以手动调用，示例如下：

```js
import * as echarts from "echarts/core";// [!code --]
import { provideEcharts } from "uni-echarts/shared";
import echarts from "/path/to/echarts.esm.js";// [!code ++]

provideEcharts(echarts);
```

### Uni Modules 方式

使用 uni-modules 方式需要手动调用，示例如下：

```js
import * as echarts from "echarts/core";// [!code --]
import { provideEcharts } from "@/uni_modules/xiaohe-echarts";
import echarts from "/path/to/echarts.esm.js";// [!code ++]

provideEcharts(echarts);
```