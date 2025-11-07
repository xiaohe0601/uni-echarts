<template>
  <!-- #region template -->
  <app-page>
    <uni-echarts custom-class="h-75" :option="option" autoresize></uni-echarts>
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
    navigationBarTitleText: "基础用法"
  }
});

echarts.use([
  LegendComponent,
  TooltipComponent,
  DatasetComponent,
  PieChart,
  CanvasRenderer
]);

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
// #endregion script
</script>