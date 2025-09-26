<template>
  <!-- #region template -->
  <app-page>
    <uni-echarts
      class="h-60"
      :option="option1"
      group="radiance"
      autoresize></uni-echarts>

    <uni-echarts
      class="h-60"
      :option="option2"
      group="radiance"
      autoresize></uni-echarts>

    <wd-cell-group class="mt-2">
      <wd-cell title="联动" center>
        <wd-switch v-model="connected"></wd-switch>
      </wd-cell>
    </wd-cell-group>
  </app-page>
  <!-- #endregion template -->
</template>

<script lang="ts" setup>
// #region script
import type { ScatterSeriesOption } from "echarts/charts";
import { ScatterChart } from "echarts/charts";
import type {
  GridComponentOption,
  LegendComponentOption,
  TooltipComponentOption,
  VisualMapComponentOption
} from "echarts/components";
import { GridComponent, LegendComponent, TooltipComponent, VisualMapComponent } from "echarts/components";
import type { ComposeOption } from "echarts/core";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { cloneDeep } from "lodash-es";
import { GLOBAL_OPTION } from "../echarts";

type EChartsOption = ComposeOption<
  | LegendComponentOption
  | GridComponentOption
  | TooltipComponentOption
  | VisualMapComponentOption
  | ScatterSeriesOption
>;

definePage({
  style: {
    navigationBarTitleText: "图表联动"
  }
});

echarts.use([
  LegendComponent,
  GridComponent,
  TooltipComponent,
  VisualMapComponent,
  ScatterChart,
  CanvasRenderer
]);

const option: EChartsOption = {
  ...GLOBAL_OPTION,
  legend: {
    top: 10,
    left: "center",
    data: ["Scatter"]
  },
  grid: {
    top: 60,
    right: 70,
    bottom: 10,
    left: 10,
    containLabel: true
  },
  tooltip: {
    formatter: "{c}",
    textStyle: {
      // #ifdef MP-WEIXIN
      textShadowBlur: 1
      // #endif
    }
  },
  xAxis: {
    type: "value",
    splitLine: {
      show: false
    }
  },
  yAxis: {
    type: "value",
    splitLine: {
      show: false
    }
  },
  visualMap: [
    {
      realtime: false,
      right: 10,
      bottom: 10,
      selectedMode: "multiple",
      dimension: 2,
      selected: {},
      min: 0,
      max: 18,
      precision: 0,
      splitNumber: 0,
      calculable: true
    }
  ],
  series: [
    {
      type: "scatter",
      name: "Scatter",
      symbolSize: 30,
      data: getData()
    }
  ]
};

const option1 = ref(cloneDeep(option));
const option2 = ref(cloneDeep(option));

function getData() {
  const data: [number, number, number, number][] = [];

  for (let i = 0; i < 16; i += 1) {
    data.push([
      Math.random() * 5,
      Math.random() * 4,
      Math.random() * 12,
      Math.round(Math.random() * 5)
    ]);
  }

  return data;
}

const connected = shallowRef(true);

watchEffect(() => {
  if (connected.value) {
    echarts.connect("radiance");
  } else {
    echarts.disconnect("radiance");
  }
});
// #endregion script
</script>