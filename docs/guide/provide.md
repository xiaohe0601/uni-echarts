# 依赖注入

Uni ECharts 为 `option`、 `theme`、`init-options`、`update-options` 和 `loading-options` 提供并导出了 provide 相关的 API，
从而可以通过 [依赖注入](https://cn.vuejs.org/guide/components/provide-inject.html) 的方式进行配置。

::: warning 注意

🚧 Web 端使用 npm 方式使用组件时，暂不支持该用法。

:::

---

例如，可以通过如下方式使用 provide API 修改 `theme`，这将会对 provide 作用域下所有的 Uni ECharts 组件有效：

```ts
// ⬇️ npm 方式
import { provideEchartsTheme } from "uni-echarts/shared";
// ⬇️ uni-modules 方式
import { provideEchartsTheme } from "@/uni_modules/xiaohe-echarts";

provideEchartsTheme("dark");
```

::: tip 提示

provide API 支持传入 字面量、ref、getter 等类型的值，组件内部通过
[toValue](https://cn.vuejs.org/api/reactivity-utilities.html#tovalue) 解析。

:::

另外，`option` 与其他选项略有不同，可以通过 `option-key` 选择控制某一个图表，如下所示：

```vue
<template>
  <uni-echarts></uni-echarts>

  <!-- 注意，option-key 不是响应式，不支持动态修改 -->
  <uni-echarts option-key="chart1"></uni-echarts>

  <uni-echarts option-key="chart2"></uni-echarts>
</template>

<script setup>
import { provideEchartsOption } from "uni-echarts/shared";
import { ref } from "vue";

const option = ref({
  // ...
});

// 第1个参数传 option 时，option 对未指定 option-key 的组件有效
provideEchartsOption(option);

// 第1个参数传入字符串时，option 仅对 option-key 与第1个参数相等的组件有效
// 例如，这里的 option 仅对 option-key 为 chart1 的组件有效
provideEchartsOption("chart1", option);
</script>
```