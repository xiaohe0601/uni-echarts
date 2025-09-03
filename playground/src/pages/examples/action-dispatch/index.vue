<template>
  <!-- #region template -->
  <app-page>
    <uni-echarts
      ref="chartEl"
      class="h-75"
      :option="option"
      autoresize></uni-echarts>
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
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { GLOBAL_OPTION } from "../echarts";
import type { UniEchartsInst } from "@/uni_modules/xiaohe-echarts";

type EChartsOption = ComposeOption<
  | LegendComponentOption
  | TooltipComponentOption
  | DatasetComponentOption
  | PieSeriesOption
>;

definePage({
  style: {
    navigationBarTitleText: "动作调度"
  }
});

use([
  LegendComponent,
  TooltipComponent,
  DatasetComponent,
  PieChart,
  CanvasRenderer
]);

const chartEl = shallowRef<UniEchartsInst | null>(null);

const option = ref({
  ...GLOBAL_OPTION,
  legend: {
    top: 10,
    left: "center"
  },
  tooltip: {
    trigger: "item",
    formatter: "{a}\n{b}: {d}%",
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

let timer = 0;

function destroyTimer() {
  if (timer === 0) {
    return;
  }

  clearInterval(timer);
  timer = 0;
}

function startActions() {
  const length = option.value.dataset.source.length;

  if (chartEl.value == null || length === 0) {
    return;
  }

  destroyTimer();

  let dataIndex = -1;

  // @ts-expect-error whatever
  timer = setInterval(() => {
    if (chartEl.value == null) {
      destroyTimer();
      return;
    }

    chartEl.value.dispatchAction({
      type: "downplay",
      seriesIndex: 0,
      dataIndex
    });
    dataIndex = (dataIndex + 1) % length;
    chartEl.value.dispatchAction({
      type: "highlight",
      seriesIndex: 0,
      dataIndex
    });
    chartEl.value.dispatchAction({
      type: "showTip",
      seriesIndex: 0,
      dataIndex
    });
  }, 1000);
}

function stopActions() {
  destroyTimer();
}

onReady(() => {
  startActions();
});

onUnload(() => {
  stopActions();
});
// #endregion script
</script>