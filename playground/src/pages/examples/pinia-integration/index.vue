<template>
  <app-page>
    <uni-echarts class="h-75" :option="getOption(metricIndex)" autoresize></uni-echarts>

    <wd-cell-group class="mt-2">
      <wd-picker
        v-model="metricIndex"
        label="对象"
        :columns="metrics"
        align-right></wd-picker>

      <wd-cell title="控制" center>
        <wd-button
          class="!mr-2"
          type="error"
          size="small"
          plain
          :disabled="isMin(metricIndex)"
          @click="increase(metricIndex, -1)">减少
        </wd-button>

        <wd-button
          type="success"
          size="small"
          plain
          :disabled="isMax(metricIndex)"
          @click="increase(metricIndex, 1)">增加
        </wd-button>
      </wd-cell>
    </wd-cell-group>
  </app-page>
</template>

<script lang="ts" setup>
import { RadarChart } from "echarts/charts";
import { TitleComponent } from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { useScoreStore } from "./data.ts";

provideEcharts(echarts);

echarts.use([
  TitleComponent,
  RadarChart,
  CanvasRenderer
]);

const { metrics, getOption, increase, isMax, isMin } = useScoreStore();

const metricIndex = shallowRef(0);
</script>

<route>
{
  "style": {
    "navigationBarTitleText": "Pinia 集成"
  }
}
</route>