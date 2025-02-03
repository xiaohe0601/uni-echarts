<template>
  <view class="container">
    <uni-echarts
      style="height: 300px"
      :option="option"
      autoresize
      disable-scroll
      support-hover
      @click="onEvent('click', $event)"
      @finished.once="onEvent('finished', $event)"
      @zr:click="onEvent('zr:click', $event)"
      @native:click="onEvent('native:click', $event)"
      @native:tap="onEvent('native:tap', $event)"></uni-echarts>
  </view>
</template>

<script lang="ts" setup>
import { PieChart } from "echarts/charts";
import { DatasetComponent, LegendComponent, TooltipComponent } from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import UniEcharts from "uni-echarts";
import { provideEcharts } from "uni-echarts/shared";

provideEcharts(echarts);

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

function onEvent(type: string, event: any) {
  // eslint-disable-next-line no-console
  console.log(`[${type}]:`, event);
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
}
</style>