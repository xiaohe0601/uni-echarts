import type { ScatterSeriesOption } from "echarts/charts";
import type {
  GridComponentOption,
  LegendComponentOption,
  TooltipComponentOption,
  VisualMapComponentOption
} from "echarts/components";
import type { ComposeOption } from "echarts/core";
import { merge } from "lodash-es";
import { GLOBAL_OPTION } from "../echarts.ts";

type EChartsOption = ComposeOption<
  | LegendComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | VisualMapComponentOption
  | ScatterSeriesOption
>;

const symbolCount = 6;

const data1: [number, number, number, number][] = [];

for (let i = 0; i < 16; i += 1) {
  data1.push([
    Math.random() * 5,
    Math.random() * 4,
    Math.random() * 12,
    Math.round(Math.random() * (symbolCount - 1))
  ]);
}

const option1: EChartsOption = merge({}, GLOBAL_OPTION, {
  legend: {
    top: "3%",
    data: ["scatter"]
  },
  tooltip: {
    formatter: "{c}"
  },
  grid: {
    top: "30%",
    right: "18%",
    bottom: "20%"
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
      right: "2%",
      bottom: "3%",
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
      name: "scatter",
      type: "scatter",
      symbolSize: 30,
      data: data1
    }
  ]
} satisfies EChartsOption);

const option2: EChartsOption = merge({}, GLOBAL_OPTION, {
  legend: {
    top: "3%",
    data: ["scatter"]
  },
  tooltip: {
    formatter: "{c}"
  },
  grid: {
    top: "30%",
    right: "18%",
    bottom: "20%"
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
      right: "2%",
      bottom: "3%",
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
      name: "scatter",
      type: "scatter",
      symbolSize: 30,
      data: data1
    }
  ]
} satisfies EChartsOption);

export function getData(): [EChartsOption, EChartsOption] {
  return [option1, option2];
}