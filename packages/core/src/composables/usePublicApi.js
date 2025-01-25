const METHOD_NAMES = [
  "getWidth",
  "getHeight",
  "getDom",
  "getOption",
  "dispatchAction",
  "convertToPixel",
  "convertFromPixel",
  "containPixel",
  "getDataURL",
  "getConnectedDataURL",
  "appendData",
  "clear",
  "isDisposed",
  "dispose"
];

export function usePublicApi(chart) {
  function makePublicMethod(name) {
    return (...args) => {
      if (chart.value == null) {
        throw new Error("ECharts is not initialized yet.");
      }

      // eslint-disable-next-line prefer-spread
      return (chart.value[name]).apply(chart.value, args);
    };
  }

  function makePublicMethods() {
    const methods = Object.create(null);

    for (const name of METHOD_NAMES) {
      methods[name] = makePublicMethod(name);
    }

    return methods;
  }

  return makePublicMethods();
}