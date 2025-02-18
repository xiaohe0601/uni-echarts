<template>
  <app-page>
    <uni-echarts
      class="h-75"
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
</template>

<script lang="ts" setup>
import { BarChart } from "echarts/charts";
import { DatasetComponent, GridComponent } from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { getData } from "./data.ts";
import theme from "./theme.json";

provideEcharts(echarts);

echarts.use([
  GridComponent,
  DatasetComponent,
  BarChart,
  CanvasRenderer
]);

echarts.registerTheme("ovilia-green", theme);

const surplus = shallowRef(0);

const loading = shallowRef(false);

const loadingOptions = {
  text: "请稍候...",
  color: "#4ea397",
  maskColor: "rgba(255, 255, 255, 0.8)"
};

const option = shallowRef(getData());

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

    loading.value = false;
    option.value = getData();
  }
}

function refresh() {
  // simulating async data from server
  surplus.value = 3;
  loading.value = true;

  // @ts-expect-error whatever
  timer = setInterval(tick, 1000);
}

onUnload(() => {
  destroyTimer();
});
</script>

<route>
{
  "style": {
    "navigationBarTitleText": "异步数据"
  }
}
</route>