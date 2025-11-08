# 常见问题

列举了一些常见问题和解决方案。

## 不支持的功能清单

受限于 uni-app 的 API，以下功能尚不支持：

- [SVG 渲染器](https://echarts.apache.org/handbook/zh/best-practices/canvas-vs-svg)
- [toolbox.feature.saveAsImage](https://echarts.apache.org/zh/option.html#toolbox.feature.saveAsImage)
- [series-map](https://echarts.apache.org/zh/option.html#series-map)
- [echarts-gl](https://github.com/ecomfe/echarts-gl)

## 小程序端 class / style 无效

在小程序端 Uni ECharts 通过 [virtualHost](https://uniapp.dcloud.net.cn/tutorial/vue-api.html#其他配置)
将自定义节点设置成
[虚拟化组件节点](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/wxml-wxss.html#虚拟化组件节点)，
使其更加接近 Vue 组件的表现。但是这将导致组件的 class / style 属性失效，所以组件提供了 custom-class / custom-style
属性来弥补这一缺陷。

- 可以在 manifest.json 的 `mp-weixin` / `mp-alipay` 字段下添加
[mergeVirtualHostAttributes](https://uniapp.dcloud.net.cn/collocation/manifest.html#mp-weixin) 配置，
用于合并小程序组件虚拟节点外层属性，这样就可以正常使用 class / style 等属性。

  ```json5
  {
    "mp-weixin": {
      // ...
      "mergeVirtualHostAttributes": true
    },
    "mp-alipay": {
      // ...
      "mergeVirtualHostAttributes": true
    }
  }
  ```

- 也可以将相关样式转移到一个单独不带 `scoped` 标识的 style 块中，使 Uni ECharts 可以共享样式。

  ```vue
  <style>
  .chart {
    height: 300px;
  }
  </style>

  <style scoped>
  /* ... */
  </style>
  ```

- 在自定义组件中如果需要覆盖 Uni ECharts 的内部样式，需要添加 `styleIsolation: "shared"` 选项。

  ```vue
  <script setup>
  defineOptions({
    options: {
      styleIsolation: "shared"
    }
  });
  </script>
  ```

## 小程序端 tooltip 文字阴影问题

具体原因未知，猜测可能是微信 canvas 的问题，可以通过设置 `textShadowBlur` 临时解决，示例如下：

```js
const option = ref({
  tooltip: {
    trigger: "item",
    textStyle: {
      // #ifdef MP-WEIXIN
      textShadowBlur: 1
      // #endif
    }
  }
});
```

::: warning 注意

目前 `textShadowBlur` 设置为 `0` 无效，所以退而求其次设置为了 `1`。

:::

## 微信开发者工具 canvas 不跟随页面滚动或者层级过高

这是微信开发者工具的 BUG，真机不受影响，可以忽略。

## 部分小程序平台不支持 option 包含诸如 formatter 的函数字段

这是部分小程序平台原生的限制，他们通过 JSON 序列化参数所以导致函数字段丢失，可以通过以下方案解决：

- 启用 [manual-update](../apis/component#attributes) 并使用 [setOption](../apis/component#exposes) 手动设置 option

- 使用 [provideEchartsOption](../apis/function#provideechartsoption) 设置 option，参考 [依赖注入](./provide)

## 在弹窗组件内使用时无法正常展示

一般弹窗组件都会添加入场动画，导致 Uni ECharts 刚渲染时无法正常获取到画布大小，所以需要将 Uni ECharts 的渲染时机延迟到弹窗动画完成后。

下面以 Wot UI 的 [Popup 弹出层](https://wot-ui.cn/component/popup.html) 为例：

```html
<template>
  <wd-popup
    v-model="visible"
    @after-enter="render = true"
    @after-leave="render = false"
  >
    <uni-echarts v-if="render" :option="option"></uni-echarts>
  </wd-popup>
</template>
```

```ts
const visible = ref(false);
const render = ref(false);
```

以上示例仅展示关键代码，详细可以参考 [弹窗内使用](../examples/popup) 部分的代码示例。