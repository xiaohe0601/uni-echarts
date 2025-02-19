<template>
  <app-page>
    <uni-echarts class="h-75" :option="option" autoresize></uni-echarts>
  </app-page>
</template>

<script lang="ts" setup>
import { ScatterChart } from "echarts/charts";
import { GridComponent, LegendComponent, TitleComponent } from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { getData } from "./data.ts";

provideEcharts(echarts);

echarts.use([
  TitleComponent,
  LegendComponent,
  GridComponent,
  ScatterChart,
  CanvasRenderer
]);

const option = shallowRef(getData());
</script>

<route>
{
  "style": {
    "navigationBarTitleText": "颜色渐变"
  }
}
</route>