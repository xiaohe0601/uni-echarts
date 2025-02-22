# 组件

## Attributes

| 参数               | 说明                                                                                             | 类型              | 可选值         | 默认值     |
|------------------|------------------------------------------------------------------------------------------------|-----------------|-------------|---------|
| custom-class     | 自定义 class                                                                                      | any             | -           | -       |
| custom-style     | 自定义 style                                                                                      | `StyleValue`    | -           | -       |
| option           | [echarts setOption option](https://echarts.apache.org/zh/api.html#echartsInstance.setOption)   | object          | -           | -       |
| option-key       | [provide option key](../guide/provide)                                                         | string          | -           | -       |
| theme            | [echarts init theme](https://echarts.apache.org/zh/api.html#echarts.init)                      | string / object | -           | -       |
| init-options     | [echarts init opts](https://echarts.apache.org/zh/api.html#echarts.init)                       | object          | -           | -       |
| update-options   | [echarts setOption opts](https://echarts.apache.org/zh/api.html#echartsInstance.setOption)     | object          | -           | -       |
| group            | [echarts group](https://echarts.apache.org/zh/api.html#echartsInstance.group)                  | string          | -           | -       |
| manual-update    | 是否手动更新 option                                                                                  | boolean         | -           | `false` |
| autoresize `WEB` | 是否自动 resize                                                                                    | `AutoResize`    | -           | `false` |
| loading          | 是否显示加载动画效果                                                                                     | boolean         | -           | `false` |
| loading-options  | [echarts showLoading opts](https://echarts.apache.org/zh/api.html#echartsInstance.showLoading) | object          | -           | -       |
| canvas-type      | [canvas type](https://uniapp.dcloud.net.cn/component/canvas.html)                              | string          | 2d / legacy | 2d      |
| disable-scroll   | 触摸时是否禁用滚动                                                                                      | boolean         | -           | `false` |
| support-hover    | PC 端是否支持 hover 行为                                                                              | boolean         | -           | `false` |
| init-delay       | 初始化延迟时间（单位：ms）                                                                                 | number          | -           | `30`    |

### 相关类型定义

```ts
type AutoResize = boolean | {
  throttle?: number;
  onResize?: () => void;
};
```

## Events

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

::: info 提示

仅支持 `.once` 修饰符（并且小程序端不支持），因为其它修饰符都与 DOM 事件机制强耦合。

:::

Uni ECharts 支持如下事件：

- [highlight](https://echarts.apache.org/zh/api.html#events.highlight)
- [downplay](https://echarts.apache.org/zh/api.html#events.downplay)
- [selectchanged](https://echarts.apache.org/zh/api.html#events.selectchanged)
- [legendselectchanged](https://echarts.apache.org/zh/api.html#events.legendselectchanged)
- [legendselected](https://echarts.apache.org/zh/api.html#events.legendselected)
- [legendunselected](https://echarts.apache.org/zh/api.html#events.legendunselected)
- [legendselectall](https://echarts.apache.org/zh/api.html#events.legendselectall)
- [legendinverseselect](https://echarts.apache.org/zh/api.html#events.legendinverseselect)
- [legendscroll](https://echarts.apache.org/zh/api.html#events.legendscroll)
- [datazoom](https://echarts.apache.org/zh/api.html#events.datazoom)
- [datarangeselected](https://echarts.apache.org/zh/api.html#events.datarangeselected)
- [timelinechanged](https://echarts.apache.org/zh/api.html#events.timelinechanged)
- [timelineplaychanged](https://echarts.apache.org/zh/api.html#events.timelineplaychanged)
- [restore](https://echarts.apache.org/zh/api.html#events.restore)
- [dataviewchanged](https://echarts.apache.org/zh/api.html#events.dataviewchanged)
- [magictypechanged](https://echarts.apache.org/zh/api.html#events.magictypechanged)
- [geoselectchanged](https://echarts.apache.org/zh/api.html#events.geoselectchanged)
- [geoselected](https://echarts.apache.org/zh/api.html#events.geoselected)
- [geounselected](https://echarts.apache.org/zh/api.html#events.geounselected)
- [axisareaselected](https://echarts.apache.org/zh/api.html#events.axisareaselected)
- [brush](https://echarts.apache.org/zh/api.html#events.brush)
- [brushEnd](https://echarts.apache.org/zh/api.html#events.brushEnd)
- [brushselected](https://echarts.apache.org/zh/api.html#events.brushselected)
- [globalcursortaken](https://echarts.apache.org/zh/api.html#events.globalcursortaken)
- [rendered](https://echarts.apache.org/zh/api.html#events.rendered)
- [finished](https://echarts.apache.org/zh/api.html#events.finished)

- 鼠标事件
  - [click](https://echarts.apache.org/zh/api.html#events.Mouse%20events.click)
  - [dblclick](https://echarts.apache.org/zh/api.html#events.Mouse%20events.dblclick)
  - [mouseover](https://echarts.apache.org/zh/api.html#events.Mouse%20events.mouseover)
  - [mouseout](https://echarts.apache.org/zh/api.html#events.Mouse%20events.mouseout)
  - [mousemove](https://echarts.apache.org/zh/api.html#events.Mouse%20events.mousemove)
  - [mousedown](https://echarts.apache.org/zh/api.html#events.Mouse%20events.mousedown)
  - [mouseup](https://echarts.apache.org/zh/api.html#events.Mouse%20events.mouseup)
  - [globalout](https://echarts.apache.org/zh/api.html#events.Mouse%20events.globalout)
  - [contextmenu](https://echarts.apache.org/zh/api.html#events.Mouse%20events.contextmenu)

- ZRender 事件
  - `zr:click`
  - `zr:mousedown`
  - `zr:mouseup`
  - `zr:mousewheel`
  - `zr:dblclick`
  - `zr:contextmenu`

更多信息请参考 [echarts events](https://echarts.apache.org/zh/api.html#events)。

### 其他事件

| 名称      | 说明         | 参数 |
|---------|------------|----|
| inited  | 初始化完成      | -  |
| showtip | 显示 tooltip | -  |
| hidetip | 隐藏 tooltip | -  |

### 原生 DOM 事件

由于 Uni ECharts 默认将事件绑定到 `echarts` 实例，因此在使用原生 DOM 事件时需要做一些特殊处理，
你需要在事件名称前加上 `native:` 前缀来绑定原生 DOM 事件。

```vue
<template>
  <!-- 注意，uni-app 中的原生 DOM 点击事件应该使用 tap 而不是 click -->
  <uni-echarts @native:tap="handleNativeTap"></uni-echarts>
</template>
```

## Slots

| 名称      | 说明 |
|---------|----|
| default | -  |

## Exposes

- [setOption](https://echarts.apache.org/zh/api.html#echartsInstance.setOption)
- [getWidth](https://echarts.apache.org/zh/api.html#echartsInstance.getWidth)
- [getHeight](https://echarts.apache.org/zh/api.html#echartsInstance.getHeight)
- [getDom](https://echarts.apache.org/zh/api.html#echartsInstance.getDom)
- [getOption](https://echarts.apache.org/zh/api.html#echartsInstance.getOption)
- [resize](https://echarts.apache.org/zh/api.html#echartsInstance.resize)
- [dispatchAction](https://echarts.apache.org/zh/api.html#echartsInstance.dispatchAction)
- [convertToPixel](https://echarts.apache.org/zh/api.html#echartsInstance.convertToPixel)
- [convertFromPixel](https://echarts.apache.org/zh/api.html#echartsInstance.convertFromPixel)
- [containPixel](https://echarts.apache.org/zh/api.html#echartsInstance.containPixel)
- [showLoading](https://echarts.apache.org/zh/api.html#echartsInstance.showLoading)
- [hideLoading](https://echarts.apache.org/zh/api.html#echartsInstance.hideLoading)
- [getDataURL](https://echarts.apache.org/zh/api.html#echartsInstance.getDataURL)
- [getConnectedDataURL](https://echarts.apache.org/zh/api.html#echartsInstance.getConnectedDataURL)
- [clear](https://echarts.apache.org/zh/api.html#echartsInstance.clear)
- [dispose](https://echarts.apache.org/zh/api.html#echartsInstance.dispose)
- [toTempFilePath](https://uniapp.dcloud.net.cn/api/canvas/canvasToTempFilePath.html) （无需传 `canvasId` 或 `canvas` 参数）

可以通过 [ref](https://cn.vuejs.org/guide/essentials/template-refs.html#ref-on-component) 调用以上方法，例如：

```vue
<template>
  <uni-echarts ref="chartEl"></uni-echarts>
</template>

<script lang="ts" setup>
import type { UniEchartsInst } from "uni-echarts/shared";
import { shallowRef } from "vue";

const chartEl = shallowRef<UniEchartsInst | null>(null);

function download() {
  if (chartEl.value == null) {
    return;
  }

  chartEl.value.toTempFilePath();
}
</script>
```

### 静态方法

静态方法请直接通过 [echarts 本身](https://echarts.apache.org/zh/api.html#echarts) 进行调用，例如：

```js
import { use } from "echarts/core";

use([
  // ...
]);
```