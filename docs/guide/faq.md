# 常见问题

列举了一些常见问题和解决方案。

## 小程序端 class / style 无效

在小程序端 Uni ECharts 通过 [virtualHost](https://uniapp.dcloud.net.cn/tutorial/vue-api.html#其他配置)
将自定义节点设置成
[虚拟化组件节点](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/wxml-wxss.html#虚拟化组件节点)，
使其更加接近 Vue 组件的表现。但是这将导致组件的 class / style 属性失效，所以组件提供了 custom-class / custom-style
属性来弥补这一缺陷。

::: tip 提示

另外，也可以在 manifest.json 的 mp-weixin 字段下添加
[mergeVirtualHostAttributes](https://uniapp.dcloud.net.cn/collocation/manifest.html#mp-weixin) 配置，
用于合并小程序组件虚拟节点外层属性，这样就可以正常使用 class / style 等属性。

:::

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