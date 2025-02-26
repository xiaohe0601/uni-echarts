import type { RadarSeriesOption } from "echarts/charts";
import type { ComposeOption } from "echarts/core";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { GLOBAL_OPTION } from "../echarts.ts";

type EChartsOption = ComposeOption<RadarSeriesOption>;

export const useScoreStore = defineStore("score", () => {
  const scores = ref([
    { name: "Attack", max: 20, value: 19 },
    { name: "Defense", max: 20, value: 9 },
    { name: "Speed", max: 20, value: 18 },
    { name: "Strength", max: 20, value: 16 },
    { name: "Endurance", max: 20, value: 16 },
    { name: "Agility", max: 20, value: 20 }
  ]);

  const metrics = computed(() => {
    return scores.value.map(({ name }, index) => ({
      label: name,
      value: index
    }));
  });

  function getOption(activeIndex: number) {
    return {
      ...GLOBAL_OPTION,
      radar: {
        indicator: scores.value.map(({ name, max }, index) => {
          return {
            name,
            max,
            color: index === activeIndex ? "goldenrod" : undefined
          };
        })
      },
      series: [
        {
          type: "radar",
          data: [
            { value: scores.value.map(({ value }) => value) }
          ]
        }
      ]
    } satisfies EChartsOption;
  }

  function isMax(index: number) {
    const { value, max } = scores.value[index]!;

    return value >= max;
  }

  function isMin(index: number) {
    const { value } = scores.value[index]!;

    return value <= 0;
  }

  function increase(index: number, value: number) {
    const metric = scores.value[index]!;

    metric.value = Math.max(0, Math.min(metric.max, metric.value + value));
  }

  return {
    scores,
    metrics,
    getOption,
    isMax,
    isMin,
    increase
  };
});