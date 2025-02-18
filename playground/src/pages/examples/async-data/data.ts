import { merge } from "lodash-es";
import { GLOBAL_OPTION } from "../echarts.ts";

function random() {
  return Math.round(300 + Math.random() * 700) / 10;
}

export function getData() {
  return merge({}, GLOBAL_OPTION, {
    xAxis: { type: "category" },
    yAxis: {},
    // Declare several bar series, each will be mapped
    // to a column of dataset.source by default.
    series: [
      { type: "bar" },
      { type: "bar" },
      { type: "bar" }
    ],
    dataset: {
      dimensions: ["Product", "2023", "2024", "2025"],
      source: [
        {
          Product: "Matcha Latte",
          2023: random(),
          2024: random(),
          2025: random()
        },
        {
          Product: "Milk Tea",
          2023: random(),
          2024: random(),
          2025: random()
        },
        {
          Product: "Cheese Cocoa",
          2023: random(),
          2024: random(),
          2025: random()
        },
        {
          Product: "Walnut Brownie",
          2023: random(),
          2024: random(),
          2025: random()
        }
      ]
    }
  });
}