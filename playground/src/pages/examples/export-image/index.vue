<template>
  <!-- #region template -->
  <app-page>
    <uni-echarts
      ref="chartEl"
      custom-class="h-75"
      :option="option"
      autoresize
    ></uni-echarts>

    <view class="flex flex-col items-center mt-2">
      <wd-button
        size="small"
        plain
        @click="saveAsImage()"
      >保存为图片
      </wd-button>
    </view>
  </app-page>
  <!-- #endregion template -->
</template>

<script lang="ts" setup>
// #region script
import type { LineSeriesOption } from "echarts/charts";
import { LineChart } from "echarts/charts";
import type { PolarComponentOption } from "echarts/components";
import { PolarComponent } from "echarts/components";
import type { ComposeOption } from "echarts/core";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import type { UniEchartsInst } from "uni-echarts/shared";
import { GLOBAL_OPTION } from "../echarts";

type EChartsOption = ComposeOption<PolarComponentOption | LineSeriesOption>;

definePage({
  style: {
    navigationBarTitleText: "保存为图片"
  }
});

echarts.use([
  PolarComponent,
  LineChart,
  CanvasRenderer
]);

const chartEl = ref<UniEchartsInst | null>(null);

const option = ref({
  ...GLOBAL_OPTION,
  backgroundColor: "#ffffff",
  polar: {},
  angleAxis: {
    type: "value",
    startAngle: 0
  },
  radiusAxis: {},
  series: [
    {
      type: "line",
      coordinateSystem: "polar",
      data: getData()
    }
  ]
} satisfies EChartsOption);

function getData() {
  const data: [number, number][] = [];

  for (let i = 0; i <= 100; i += 1) {
    const theta = (i / 100) * 360;
    const r = 5 * (1 + Math.sin((theta / 180) * Math.PI));

    data.push([r, theta]);
  }

  return data;
}

async function saveAsImage() {
  if (chartEl.value == null) {
    return;
  }

  const { tempFilePath } = await chartEl.value.toTempFilePath();

  uni.previewImage({
    urls: [tempFilePath]
  });
}
// #endregion script
</script>