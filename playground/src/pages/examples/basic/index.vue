<template>
  <app-page>
    <uni-echarts class="h-75" :option="option" autoresize></uni-echarts>
  </app-page>
</template>

<script lang="ts" setup>
import { PieChart } from "echarts/charts";
import { DatasetComponent, LegendComponent, TooltipComponent } from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { getData } from "./data.ts";

provideEcharts(echarts);

echarts.use([
  LegendComponent,
  TooltipComponent,
  DatasetComponent,
  PieChart,
  CanvasRenderer
]);

const option = shallowRef(getData());
</script>

<route>
{
  "style": {
    "navigationBarTitleText": "基础用法"
  }
}
</route>