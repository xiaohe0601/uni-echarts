import { merge } from "lodash-es";
import { GLOBAL_OPTION } from "../echarts.ts";

export function getData() {
  return merge({}, GLOBAL_OPTION, {
    legend: {
      top: 10,
      left: "center"
    },
    tooltip: {
      trigger: "item",
      textStyle: {
        // #ifdef MP-WEIXIN
        textShadowBlur: 1
        // #endif
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
  });
}