import { presetUni } from "@uni-helper/unocss-preset-uni";
import { defineConfig, presetIcons, transformerVariantGroup } from "unocss";

export default defineConfig({
  theme: {
    colors: {
      primary: "rgba(var(--color-primary), <alpha-value>)",
      success: "rgba(var(--color-success), <alpha-value>)",
      warning: "rgba(var(--color-warning), <alpha-value>)",
      danger: "rgba(var(--color-danger), <alpha-value>)",
      error: "rgba(var(--color-error), <alpha-value>)",
      info: "rgba(var(--color-info), <alpha-value>)",
      t1: "rgba(var(--color-t1), <alpha-value>)",
      t2: "rgba(var(--color-t2), <alpha-value>)",
      t3: "rgba(var(--color-t3), <alpha-value>)",
      t4: "rgba(var(--color-t4), <alpha-value>)",
      t5: "rgba(var(--color-t5), <alpha-value>)",
      b1: "rgba(var(--color-b1), <alpha-value>)",
      b2: "rgba(var(--color-b2), <alpha-value>)",
      d1: "rgba(var(--color-d1), <alpha-value>)",
      d2: "rgba(var(--color-d2), <alpha-value>)",
      d3: "rgba(var(--color-d3), <alpha-value>)",
      d4: "rgba(var(--color-d4), <alpha-value>)"
    },
    fontFamily: {
      global: "var(--font-global)"
    }
  },
  presets: [
    presetUni({
      attributify: {
        prefixedOnly: true
      }
    }),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        "display": "inline-block",
        "vertical-align": "middle"
      }
    })
  ],
  transformers: [
    transformerVariantGroup()
  ]
});