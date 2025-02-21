<template>
  <app-page>
    <uni-echarts
      ref="chartEl"
      class="h-75"
      manual-update
      autoresize></uni-echarts>
  </app-page>
</template>

<script lang="ts" setup>
import { LineChart } from "echarts/charts";
import {
  DataZoomComponent,
  GridComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent
} from "echarts/components";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { getData } from "./data.ts";
import type { UniEchartsInst } from "@/uni_modules/xiaohe-echarts";

use([
  TooltipComponent,
  TitleComponent,
  ToolboxComponent,
  GridComponent,
  DataZoomComponent,
  LineChart,
  CanvasRenderer
]);

const chartEl = ref<UniEchartsInst | null>(null);

function update() {
  if (chartEl.value == null) {
    return;
  }

  chartEl.value.setOption(getData());
}

onReady(() => {
  update();
});
</script>

<route>
{
  "style": {
    "navigationBarTitleText": "手动更新"
  }
}
</route>