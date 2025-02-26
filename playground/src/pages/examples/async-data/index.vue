<template>
  <!-- #region template -->
  <app-page>
    <uni-echarts
      class="h-60"
      :option="option"
      theme="ovilia-green"
      autoresize
      :loading="loading"
      :loading-options="loadingOptions"></uni-echarts>

    <view class="flex flex-col items-center mt-2">
      <text v-if="surplus > 0" class="text-base text-t3">
        数据将在
        <text class="text-primary mx-1">{{ surplus }}</text>
        秒后完成加载...
      </text>

      <wd-button
        v-else
        size="small"
        plain
        @click="refresh()">更新数据
      </wd-button>
    </view>
  </app-page>
  <!-- #endregion template -->
</template>

<script lang="ts" setup>
// #region script
import type { BarSeriesOption } from "echarts/charts";
import { BarChart } from "echarts/charts";
import type { DatasetComponentOption, GridComponentOption } from "echarts/components";
import { DatasetComponent, GridComponent } from "echarts/components";
import type { ComposeOption } from "echarts/core";
import { registerTheme, use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { GLOBAL_OPTION } from "../echarts.ts";
import theme from "./theme.json";

type EChartsOption = ComposeOption<
  | GridComponentOption
  | DatasetComponentOption
  | BarSeriesOption
>;

use([
  GridComponent,
  DatasetComponent,
  BarChart,
  CanvasRenderer
]);

registerTheme("ovilia-green", theme);

const option = ref({
  ...GLOBAL_OPTION,
  grid: {
    top: 20,
    right: 10,
    bottom: 10,
    left: 10,
    containLabel: true
  },
  xAxis: {
    type: "category"
  },
  yAxis: {},
  series: [
    { type: "bar" },
    { type: "bar" },
    { type: "bar" }
  ],
  dataset: {
    dimensions: ["Product", "2023", "2024", "2025"],
    source: getData()
  }
} satisfies EChartsOption);

const loading = shallowRef(false);

const loadingOptions = {
  text: "请稍候...",
  color: "#4ea397",
  maskColor: "rgba(255, 255, 255, 0.8)"
};

function random() {
  return Math.round(300 + Math.random() * 700) / 10;
}

function getData() {
  return [
    {
      Product: "Matcha Latte",
      2023: random(),
      2024: random(),
      2025: random()
    },
    {
      Product: "Milk Tea",
      2023: random(),
      2024: random(),
      2025: random()
    },
    {
      Product: "Cheese Cocoa",
      2023: random(),
      2024: random(),
      2025: random()
    },
    {
      Product: "Walnut Brownie",
      2023: random(),
      2024: random(),
      2025: random()
    }
  ];
}

const surplus = shallowRef(0);

let timer = 0;

function destroyTimer() {
  if (timer === 0) {
    return;
  }

  clearInterval(timer);
  timer = 0;
}

function tick() {
  surplus.value -= 1;

  if (surplus.value <= 0) {
    destroyTimer();

    option.value.dataset.source = getData();
    loading.value = false;
  }
}

function refresh() {
  loading.value = true;
  surplus.value = 3;

  timer = setInterval(tick, 1000);
}

onUnload(() => {
  destroyTimer();
});
// #endregion script
</script>

<route>
{
  "style": {
    "navigationBarTitleText": "异步数据"
  }
}
</route>