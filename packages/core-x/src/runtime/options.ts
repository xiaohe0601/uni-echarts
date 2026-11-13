export function isOptionEmpty(option: any): boolean {
  if (option == null) {
    return true;
  }

  if (Array.isArray(option)) {
    return option.length === 0;
  }

  if (typeof option === "object") {
    return Object.keys(option).length === 0;
  }

  return false;
}

function normalizeTooltip(tooltip: any): any {
  if (tooltip == null) {
    return tooltip;
  }

  if (Array.isArray(tooltip)) {
    return tooltip.map((item) => normalizeTooltip(item));
  }

  if (typeof tooltip !== "object") {
    return tooltip;
  }

  if (tooltip.renderMode === "richText") {
    return tooltip;
  }

  return {
    ...tooltip,
    renderMode: "richText"
  };
}

function normalizeSeries(series: any): any {
  if (series == null || typeof series !== "object") {
    return series;
  }

  if (Array.isArray(series)) {
    return series.map((item) => normalizeSeries(item));
  }

  if (series.tooltip == null) {
    return series;
  }

  return {
    ...series,
    tooltip: normalizeTooltip(series.tooltip)
  };
}

export function normalizeVaporOption(option: any): any {
  if (option == null || typeof option !== "object") {
    return option;
  }

  if (Array.isArray(option)) {
    return option.map((item) => normalizeVaporOption(item));
  }

  if (option.tooltip == null && option.series == null) {
    return option;
  }

  return {
    ...option,
    ...(option.tooltip == null ? {} : { tooltip: normalizeTooltip(option.tooltip) }),
    ...(option.series == null ? {} : { series: normalizeSeries(option.series) })
  };
}