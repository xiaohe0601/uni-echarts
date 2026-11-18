import { describe, expect, it } from "vitest";
import {
  isOptionEmpty,
  normalizeVaporOption
} from "../packages/core-x/src/runtime/options";

describe("core-x option normalization", () => {
  it("detects empty options", () => {
    expect(isOptionEmpty(null)).toBe(true);
    expect(isOptionEmpty([])).toBe(true);
    expect(isOptionEmpty({})).toBe(true);
    expect(isOptionEmpty({ series: [] })).toBe(false);
    expect(isOptionEmpty([] as any[])).toBe(true);
  });

  it("forces top-level and series tooltips to richText without mutating input", () => {
    const option = {
      tooltip: {
        trigger: "axis"
      },
      series: [
        {
          type: "line",
          tooltip: {
            formatter: "{b}"
          },
          data: [1, 2, 3]
        },
        {
          type: "bar",
          data: [4, 5, 6]
        }
      ]
    };

    const normalized = normalizeVaporOption(option);

    expect(normalized).not.toBe(option);
    expect(normalized.tooltip).toEqual({
      trigger: "axis",
      renderMode: "richText"
    });
    expect(normalized.series[0].tooltip).toEqual({
      formatter: "{b}",
      renderMode: "richText"
    });
    expect(normalized.series[1]).toBe(option.series[1]);
    expect(option.tooltip).toEqual({ trigger: "axis" });
    expect(option.series[0].tooltip).toEqual({ formatter: "{b}" });
  });

  it("normalizes tooltip arrays and preserves richText entries", () => {
    const richText = {
      renderMode: "richText",
      trigger: "item"
    };
    const normalized = normalizeVaporOption({
      tooltip: [
        richText,
        { trigger: "axis" }
      ]
    });

    expect(normalized.tooltip[0]).toBe(richText);
    expect(normalized.tooltip[1]).toEqual({
      trigger: "axis",
      renderMode: "richText"
    });
  });

  it("normalizes multi-option arrays", () => {
    const option = [
      { tooltip: { trigger: "axis" } },
      { series: { type: "pie", tooltip: { trigger: "item" } } }
    ];
    const normalized = normalizeVaporOption(option);

    expect(normalized[0].tooltip.renderMode).toBe("richText");
    expect(normalized[1].series.tooltip.renderMode).toBe("richText");
  });
});