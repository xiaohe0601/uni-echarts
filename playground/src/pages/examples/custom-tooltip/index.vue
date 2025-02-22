<template>
  <app-page>
    <uni-echarts
      class="h-75"
      :option="option"
      autoresize
      @showtip="tooltip.visible = true"
      @hidetip="tooltip.visible = false">
      <view v-if="tooltip.visible" class="absolute" :style="tooltipStyles">
        <view
          v-for="(item) in tooltip.params"
          :key="item.seriesId"
          class="p-2 bg-white rounded-md shadow">
          <text>{{ `${item.value[0]}：${item.value[1]}` }}</text>
        </view>
      </view>
    </uni-echarts>
  </app-page>
</template>

<script lang="ts" setup>
import type { PieSeriesOption } from "echarts/charts";
import { PieChart } from "echarts/charts";
import type { DatasetComponentOption, TooltipComponentOption } from "echarts/components";
import { DatasetComponent, TooltipComponent } from "echarts/components";
import type { ComposeOption } from "echarts/core";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { castArray, merge } from "lodash-es";
import type { CSSProperties } from "vue";
import { GLOBAL_OPTION } from "@/pages/examples/echarts.ts";

type EChartsOption = ComposeOption<
  | TooltipComponentOption
  | DatasetComponentOption
  | PieSeriesOption
>;

use([
  TooltipComponent,
  DatasetComponent,
  PieChart,
  CanvasRenderer
]);

const tooltip = reactive({
  visible: false,
  position: [0, 0],
  params: [] as any[]
});

const tooltipStyles = computed<CSSProperties>(() => {
  const [x, y] = tooltip.position;

  return {
    top: `${y}px`,
    left: `${x}px`
  };
});

const option = shallowRef(merge({}, GLOBAL_OPTION, {
  tooltip: {
    trigger: "item",
    position(point, params) {
      tooltip.position = point;
      tooltip.params = castArray(params);

      return point;
    },
    formatter() {
      return "";
    }
  },
  series: [
    {
      type: "pie",
      radius: ["30%", "52%"],
      label: {
        show: false,
        position: "center"
      },
      itemStyle: {
        borderWidth: 2,
        borderColor: "#ffffff",
        borderRadius: 10
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 20
        }
      }
    }
  ],
  dataset: {
    dimensions: ["来源", "数量"],
    source: [
      ["Search Engine", 1048],
      ["Direct", 735],
      ["Email", 580],
      ["Union Ads", 484],
      ["Video Ads", 300]
    ]
  }
} satisfies EChartsOption));
</script>

<route>
{
  "style": {
    "navigationBarTitleText": "自定义 Tooltip"
  }
}
</route>