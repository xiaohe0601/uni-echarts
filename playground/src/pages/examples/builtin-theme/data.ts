const data: [number, number][] = [];

for (let i = 0; i <= 360; i += 1) {
  const t = (i / 180) * Math.PI;
  const r = Math.sin(2 * t) * Math.cos(2 * t);
  data.push([r, i]);
}

export function getData() {
  return {
    title: {
      text: "Dual Numeric Axis",
      top: "5%",
      left: "5%"
    },
    legend: {
      data: ["line"],
      top: "6%"
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross"
      }
    },
    polar: {
      radius: "65%",
      center: ["50%", "56%"]
    },
    angleAxis: {
      type: "value",
      startAngle: 0
    },
    radiusAxis: {
      min: 0
    },
    series: [
      {
        type: "line",
        coordinateSystem: "polar",
        name: "line",
        showSymbol: false
      }
    ],
    animationDuration: 2000,
    dataset: {
      source: data
    }
  };
}