<template>
  <!-- #region template -->
  <app-page>
    <wd-cell title="打开弹窗" is-link @click="open()"></wd-cell>

    <wd-popup
      v-model="visible"
      custom-class="rounded-md"
      @after-enter="render = true"
      @after-leave="render = false"
    >
      <view class="size-80">
        <uni-echarts
          v-if="render"
          custom-class="size-full"
          :option="option"
          autoresize
        ></uni-echarts>
      </view>
    </wd-popup>
  </app-page>
  <!-- #endregion template -->
</template>

<script lang="ts" setup>
// #region script
import type { PieSeriesOption } from "echarts/charts";
import { PieChart } from "echarts/charts";
import type { DatasetComponentOption, LegendComponentOption, TooltipComponentOption } from "echarts/components";
import { DatasetComponent, LegendComponent, TooltipComponent } from "echarts/components";
import type { ComposeOption } from "echarts/core";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { GLOBAL_OPTION } from "../echarts";

type EChartsOption = ComposeOption<
  | LegendComponentOption
  | TooltipComponentOption
  | DatasetComponentOption
  | PieSeriesOption
>;

definePage({
  style: {
    navigationBarTitleText: "弹窗内使用"
  }
});

echarts.use([
  LegendComponent,
  TooltipComponent,
  DatasetComponent,
  PieChart,
  CanvasRenderer
]);

const visible = ref(false);
const render = ref(false);

const option = ref({
  ...GLOBAL_OPTION,
  legend: {
    top: 10,
    left: "center"
  },
  tooltip: {
    trigger: "item",
    textStyle: {
      // #ifdef MP-WEIXIN
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
} satisfies EChartsOption);

function open() {
  visible.value = true;
}
// #endregion script
</script>