<template>
  <app-page>
    <uni-echarts
      class="h-75"
      :option="option1"
      group="radiance"
      autoresize></uni-echarts>

    <uni-echarts
      class="h-75"
      :option="option2"
      group="radiance"
      autoresize></uni-echarts>

    <wd-cell-group class="mt-2">
      <wd-cell title="联动" center>
        <wd-switch v-model="connected"></wd-switch>
      </wd-cell>
    </wd-cell-group>
  </app-page>
</template>

<script lang="ts" setup>
import { ScatterChart } from "echarts/charts";
import { GridComponent, LegendComponent, TooltipComponent, VisualMapComponent } from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { getData } from "./data.ts";

echarts.use([
  LegendComponent,
  TooltipComponent,
  GridComponent,
  VisualMapComponent,
  ScatterChart,
  CanvasRenderer
]);

const [o1, o2] = getData();

const option1 = shallowRef(o1);
const option2 = shallowRef(o2);

const connected = shallowRef(true);

watchEffect(() => {
  if (connected.value) {
    echarts.connect("radiance");
  } else {
    echarts.disconnect("radiance");
  }
});
</script>

<route>
{
  "style": {
    "navigationBarTitleText": "图表联动"
  }
}
</route>