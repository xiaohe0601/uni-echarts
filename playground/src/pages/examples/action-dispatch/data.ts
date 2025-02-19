import { merge } from "lodash-es";
import { GLOBAL_OPTION } from "../echarts.ts";

export function getData() {
  return merge({}, GLOBAL_OPTION, {
    title: {
      text: "Traffic Sources",
      top: "5%",
      left: "center"
    },
    legend: {
      orient: "vertical",
      top: "5%",
      left: "5%"
    },
    tooltip: {
      trigger: "item",
      formatter: "{a}\n{b}: {c} ({d}%)",
      textStyle: {
        // #ifdef MP-WEIXIN
        textShadowBlur: 1
        // #endif
      }
    },
    series: [
      {
        type: "pie",
        name: "Traffic Sources",
        radius: "55%",
        center: ["50%", "60%"],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        }
      }
    ],
    dataset: {
      dimensions: ["source", "value"],
      source: [
        ["Direct", 335],
        ["Email", 310],
        ["Ad Networks", 234],
        ["Video Ads", 135],
        ["Search Engines", 1548]
      ]
    }
  });
}