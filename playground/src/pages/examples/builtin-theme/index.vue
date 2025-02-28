<template>
  <!-- #region template -->
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
  <!-- #endregion template -->
</template>

<script lang="ts" setup>
// #region script
import type { LineSeriesOption } from "echarts/charts";
import { LineChart } from "echarts/charts";
import type {
  DatasetComponentOption,
  LegendComponentOption,
  PolarComponentOption,
  TooltipComponentOption
} from "echarts/components";
import { DatasetComponent, LegendComponent, PolarComponent, TooltipComponent } from "echarts/components";
import type { ComposeOption } from "echarts/core";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import type { CSSProperties } from "vue";
import { GLOBAL_OPTION } from "../echarts";

type EChartsOption = ComposeOption<
  | LegendComponentOption
  | TooltipComponentOption
  | PolarComponentOption
  | DatasetComponentOption
  | LineSeriesOption
>;

use([
  LegendComponent,
  TooltipComponent,
  PolarComponent,
  DatasetComponent,
  LineChart,
  CanvasRenderer
]);

const option = ref({
  ...GLOBAL_OPTION,
  legend: {
    top: 10,
    left: "center"
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross"
    },
    textStyle: {
      // #ifdef MP-WEIXIN
      textShadowBlur: 1
      // #endif
    }
  },
  polar: {
    radius: "60%",
    center: ["50%", "56%"]
  },
  angleAxis: {
    type: "value",
    startAngle: 0
  },
  radiusAxis: {
    min: 0
  },
  series: [
    {
      type: "line",
      coordinateSystem: "polar",
      showSymbol: false
    }
  ],
  dataset: {
    dimensions: ["数值"],
    source: getData()
  }
} satisfies EChartsOption);

const theme = shallowRef("dark");

const loading = shallowRef(false);

const loadingOptions = computed(() => {
  const value = {
    text: "请稍候..."
  };

  if (theme.value === "dark") {
    Object.assign(value, {
      color: "#ffffff",
      textColor: "#ffffff",
      maskColor: "rgba(0, 0, 0, 0.7)"
    });
  }

  return value;
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

function getData() {
  const data: [number, number][] = [];

  for (let i = 0; i <= 360; i += 1) {
    const t = (i / 180) * Math.PI;
    const r = Math.sin(2 * t) * Math.cos(2 * t);

    data.push([r, i]);
  }

  return data;
}
// #endregion script
</script>

<route>
{
  "style": {
    "navigationBarTitleText": "内置主题"
  }
}
</route>