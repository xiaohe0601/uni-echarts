import type { RadarSeriesOption } from "echarts/charts";
import type { TitleComponentOption } from "echarts/components";
import type { ComposeOption } from "echarts/core";
import { merge } from "lodash-es";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { GLOBAL_OPTION } from "../echarts.ts";

type EChartsOption = ComposeOption<TitleComponentOption | RadarSeriesOption>;

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

  function getOption(activeIndex: number): EChartsOption {
    return merge({}, GLOBAL_OPTION, {
      title: {
        text: "Player Ability",
        top: "5%",
        left: "5%"
      },
      radar: {
        indicator: scores.value.map(({ name, max }, index) => {
          if (index === activeIndex) {
            return { name, max, color: "goldenrod" };
          }

          return { name, max };
        })
      },
      series: [
        {
          name: "Value",
          type: "radar",
          data: [
            { value: scores.value.map(({ value }) => value) }
          ]
        }
      ]
    } satisfies EChartsOption);
  }

  function increase(index: number, amount: number) {
    const metric = scores.value[index]!;

    metric.value = Math.max(Math.min(metric.value + amount, metric.max), 0);
  }

  function isMax(index: number) {
    const { value, max } = scores.value[index]!;

    return value === max;
  }

  function isMin(index: number) {
    return scores.value[index]!.value === 0;
  }

  return {
    scores,
    metrics,
    getOption,
    increase,
    isMax,
    isMin
  };
});