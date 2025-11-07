<template>
  <!-- #region template -->
  <app-page>
    <uni-echarts custom-class="h-75" :option="getOption(metricIndex)" autoresize></uni-echarts>

    <wd-cell-group class="mt-2">
      <wd-picker
        v-model="metricIndex"
        label="对象"
        :columns="metrics"
        align-right
      ></wd-picker>

      <wd-cell title="控制" center>
        <wd-button
          class="!mr-2"
          type="error"
          size="small"
          plain
          :disabled="isMin(metricIndex)"
          @click="increase(metricIndex, -1)"
        >减少
        </wd-button>

        <wd-button
          type="success"
          size="small"
          plain
          :disabled="isMax(metricIndex)"
          @click="increase(metricIndex, 1)"
        >增加
        </wd-button>
      </wd-cell>
    </wd-cell-group>
  </app-page>
  <!-- #endregion template -->
</template>

<script lang="ts" setup>
// #region script
import { RadarChart } from "echarts/charts";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { useScoreStore } from "./score";

definePage({
  style: {
    navigationBarTitleText: "Pinia 集成"
  }
});

echarts.use([
  RadarChart,
  CanvasRenderer
]);

const { metrics, getOption, isMax, isMin, increase } = useScoreStore();

const metricIndex = shallowRef(0);
// #endregion script
</script>