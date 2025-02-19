<template>
  <app-page>
    <uni-echarts
      class="h-75"
      :style="styles"
      :option="option"
      :theme="theme"
      autoresize
      :loading="loading"
      :loading-options="loadingOptions"></uni-echarts>

    <wd-cell-group class="mt-2">
      <wd-cell title="主题" title-width="80px" center>
        <wd-radio-group v-model="theme" class="leading-none" shape="button">
          <wd-radio value="light">Light</wd-radio>
          <wd-radio class="!mr-0" value="dark">Dark</wd-radio>
        </wd-radio-group>
      </wd-cell>

      <wd-cell title="加载状态" title-width="80px" center>
        <wd-switch v-model="loading"></wd-switch>
      </wd-cell>
    </wd-cell-group>
  </app-page>
</template>

<script lang="ts" setup>
import { LineChart } from "echarts/charts";
import {
  DatasetComponent,
  LegendComponent,
  PolarComponent,
  TitleComponent,
  TooltipComponent
} from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import type { CSSProperties } from "vue";
import { getData } from "./data.ts";

provideEcharts(echarts);

echarts.use([
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  PolarComponent,
  DatasetComponent,
  LineChart,
  CanvasRenderer
]);

const option = shallowRef(getData());

const theme = shallowRef("dark");

const loading = shallowRef(false);

const loadingOptions = computed(() => {
  if (theme.value !== "dark") {
    return undefined;
  }

  return {
    color: "#ffffff",
    textColor: "#ffffff",
    maskColor: "rgba(0, 0, 0, 0.7)"
  };
});

const styles = computed(() => {
  const value: CSSProperties = {};

  if (theme.value === "dark") {
    if (loading.value) {
      value.backgroundColor = "#05040d";
    } else {
      value.backgroundColor = "#100c2a";
    }
  }

  return value;
});
</script>

<route>
{
  "style": {
    "navigationBarTitleText": "内置主题"
  }
}
</route>