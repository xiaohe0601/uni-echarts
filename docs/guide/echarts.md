# 关于 ECharts

一些 echarts 相关的说明。

## 按需导入

由于小程序对于代码体积的要求非常严苛，所以我们鼓励手动从 `echarts` 中按需导入组件和图表，以减小打包体积。
[vue-echarts](https://github.com/ecomfe/vue-echarts) 团队构建了一个 [导入代码生成器](https://vue-echarts.dev/#codegen)，
你只需要把 `option` 的代码粘贴进去，就可以得到精确的导入代码。[试一试](https://vue-echarts.dev/#codegen)

![](https://github.com/ecomfe/vue-echarts/assets/1726061/f9c38a06-3422-4f0e-ab8c-f242d9aea9aa)

但如果你实在需要全量引入 `echarts` 从而无需手动导入模块，只需要在代码中添加：

```js
import "echarts";
```