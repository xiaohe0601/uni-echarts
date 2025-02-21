<template>
  <app-page>
    <uni-echarts
      ref="chartEl"
      class="h-75"
      :option="option"
      autoresize></uni-echarts>
  </app-page>
</template>

<script lang="ts" setup>
import { PieChart } from "echarts/charts";
import { DatasetComponent, LegendComponent, TitleComponent, TooltipComponent } from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { getData } from "./data.ts";
import type { UniEchartsInst } from "@/uni_modules/xiaohe-echarts";

echarts.use([
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  DatasetComponent,
  PieChart,
  CanvasRenderer
]);

const chartEl = shallowRef<UniEchartsInst | null>(null);

const option = shallowRef(getData());

let timer = 0;

function destroyTimer() {
  if (timer === 0) {
    return;
  }

  clearInterval(timer);
  timer = 0;
}

function startActions() {
  const dataLen = option.value?.dataset?.source?.length || 0;

  if (chartEl.value == null || dataLen === 0) {
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
    dataIndex = (dataIndex + 1) % dataLen;
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
</script>

<route>
{
  "style": {
    "navigationBarTitleText": "动作调度"
  }
}
</route>