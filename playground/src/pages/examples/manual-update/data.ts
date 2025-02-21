import type { LineSeriesOption } from "echarts/charts";
import type {
  DataZoomComponentOption,
  GridComponentOption,
  TitleComponentOption,
  ToolboxComponentOption,
  TooltipComponentOption
} from "echarts/components";
import type { ComposeOption } from "echarts/core";
import { merge } from "lodash-es";
import { GLOBAL_OPTION } from "../echarts.ts";

type EChartsOption = ComposeOption<
  | TooltipComponentOption
  | TitleComponentOption
  | ToolboxComponentOption
  | GridComponentOption
  | DataZoomComponentOption
  | LineSeriesOption
>;

export function getData(): EChartsOption {
  let base = new Date(1988, 9, 3).valueOf();

  const day1 = 24 * 3600 * 1000;

  const data = [
    [base, Math.random() * 300]
  ];

  for (let i = 1; i < 20000; i++) {
    data.push(
      [new Date((base += day1)).valueOf(), Math.round((Math.random() - 0.5) * 20 + data[i - 1]![1]!)]
    );
  }

  return merge({}, GLOBAL_OPTION, {
    tooltip: {
      trigger: "axis",
      position(point) {
        return [point[0], "10%"];
      }
    },
    title: {
      left: "center",
      text: "Large Ara Chart"
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: "none"
        },
        restore: {}
      }
    },
    xAxis: {
      type: "time"
    },
    yAxis: {
      type: "value",
      boundaryGap: [0, "100%"]
    },
    dataZoom: [
      {
        type: "inside",
        start: 0,
        end: 20
      },
      {
        start: 0,
        end: 20
      }
    ],
    series: [
      {
        name: "Fake Data",
        type: "line",
        smooth: true,
        symbol: "none",
        areaStyle: {},
        data
      }
    ]
  } satisfies EChartsOption);
}