<template>
  <app-page>
    <uni-echarts
      ref="chartEl"
      class="h-75"
      :option="option"
      autoresize></uni-echarts>

    <view class="flex flex-col items-center mt-2">
      <wd-button
        size="small"
        plain
        @click="saveAsImage()">保存为图片
      </wd-button>
    </view>
  </app-page>
</template>

<script lang="ts" setup>
import { LineChart } from "echarts/charts";
import { PolarComponent } from "echarts/components";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { getData } from "./data.ts";
import type { UniEchartsInst } from "@/uni_modules/xiaohe-echarts";

use([
  PolarComponent,
  LineChart,
  CanvasRenderer
]);

const chartEl = ref<UniEchartsInst | null>(null);

const option = shallowRef(getData());

async function saveAsImage() {
  if (chartEl.value == null) {
    return;
  }

  const { tempFilePath } = await chartEl.value.toTempFilePath();

  uni.previewImage({
    urls: [tempFilePath]
  });
}
</script>

<route>
{
  "style": {
    "navigationBarTitleText": "保存为图片"
  }
}
</route>