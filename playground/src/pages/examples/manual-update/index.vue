<template>
  <!-- #region template -->
  <app-page>
    <uni-echarts
      ref="chartEl"
      class="h-75"
      manual-update
      autoresize
      @inited="setOption()"></uni-echarts>
  </app-page>
  <!-- #endregion template -->
</template>

<script lang="ts" setup>
// #region script
import type { LineSeriesOption } from "echarts/charts";
import { LineChart } from "echarts/charts";
import type {
  DataZoomComponentOption,
  GridComponentOption,
  ToolboxComponentOption,
  TooltipComponentOption
} from "echarts/components";
import { DataZoomComponent, GridComponent, ToolboxComponent, TooltipComponent } from "echarts/components";
import type { ComposeOption } from "echarts/core";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import type { UniEchartsInst } from "uni-echarts/shared";
import { GLOBAL_OPTION } from "../echarts";

type EChartsOption = ComposeOption<
  | TooltipComponentOption
  | ToolboxComponentOption
  | GridComponentOption
  | DataZoomComponentOption
  | LineSeriesOption
>;

definePage({
  style: {
    navigationBarTitleText: "手动更新"
  }
});

provideEcharts(echarts);

echarts.use([
  TooltipComponent,
  ToolboxComponent,
  GridComponent,
  DataZoomComponent,
  LineChart,
  CanvasRenderer
]);

const chartEl = ref<UniEchartsInst | null>(null);

function getData() {
  let base = new Date(1988, 9, 3).valueOf();

  const day1 = 24 * 3600 * 1000;

  const data = [
    [base, Math.random() * 300]
  ];

  for (let i = 1; i < 20000; i += 1) {
    data.push(
      [new Date((base += day1)).valueOf(), Math.round((Math.random() - 0.5) * 20 + data[i - 1][1])]
    );
  }

  return data;
}

function setOption() {
  if (chartEl.value == null) {
    return;
  }

  const data = getData();

  chartEl.value.setOption({
    ...GLOBAL_OPTION,
    grid: {
      top: 40,
      right: 16,
      bottom: 56,
      left: 10,
      containLabel: true
    },
    tooltip: {
      trigger: "axis",
      position(point) {
        return [point[0], "10%"];
      },
      textStyle: {
        // #ifdef MP-WEIXIN
        textShadowBlur: 1
        // #endif
      }
    },
    toolbox: {
      top: 0,
      right: 10,
      feature: {
        dataZoom: {
          yAxisIndex: "none"
        },
        restore: {}
      }
    },
    xAxis: {
      type: "time"
    },
    yAxis: {
      type: "value",
      boundaryGap: [0, "100%"]
    },
    dataZoom: [
      { type: "inside", start: 0, end: 20 },
      { type: "slider", start: 0, end: 20 }
    ],
    series: [
      {
        type: "line",
        name: "Fake Data",
        smooth: true,
        symbol: "none",
        areaStyle: {},
        data
      }
    ]
  } satisfies EChartsOption);
}
// #endregion script
</script>