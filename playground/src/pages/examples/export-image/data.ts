import type { LineSeriesOption } from "echarts/charts";
import type {
  LegendComponentOption,
  PolarComponentOption,
  TitleComponentOption,
  TooltipComponentOption
} from "echarts/components";
import type { ComposeOption } from "echarts/core";
import { merge } from "lodash-es";
import { GLOBAL_OPTION } from "../echarts.ts";

type EChartsOption = ComposeOption<
  | TitleComponentOption
  | LegendComponentOption
  | PolarComponentOption
  | TooltipComponentOption
  | LineSeriesOption
>;

export function getData(): EChartsOption {
  const data = [];

  for (let i = 0; i <= 100; i += 1) {
    const theta = (i / 100) * 360;
    const r = 5 * (1 + Math.sin((theta / 180) * Math.PI));

    data.push([r, theta]);
  }

  return merge({}, GLOBAL_OPTION, {
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
        name: "line",
        coordinateSystem: "polar",
        data
      }
    ]
  } satisfies EChartsOption);
}