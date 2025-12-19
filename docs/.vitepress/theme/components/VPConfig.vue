<template>
  <div class="VPConfig"></div>
</template>

<script lang="ts" setup>
// eslint-disable-next-line vue/prefer-import-from-vue
import { stringifyStyle } from "@vue/shared";
import { useStyleTag } from "@vueuse/core";
import { useData } from "vitepress";
import { computed, reactive, watchEffect } from "vue";
import { useConfig } from "../composables/useConfig";
import { createPalette } from "../utils/palette";

const rootStyle = reactive(useStyleTag(""));

const { isDark } = useData();

const config = reactive(useConfig());

const palette = computed(() => {
  if (config.data == null) {
    return undefined;
  }

  return createPalette(config.data.themeColor);
});

watchEffect(() => {
  if (palette.value == null) {
    return;
  }

  if (isDark.value) {
    const { dark } = palette.value;

    rootStyle.css = `:root {${stringifyStyle({
      "--vp-c-brand-1": dark.color1,
      "--vp-c-brand-2": dark.color2,
      "--vp-c-brand-3": dark.color3,
      "--vp-c-brand-soft": dark.soft
    })}}`;
  } else {
    const { light } = palette.value;

    rootStyle.css = `:root {${stringifyStyle({
      "--vp-c-brand-1": light.color1,
      "--vp-c-brand-2": light.color2,
      "--vp-c-brand-3": light.color3,
      "--vp-c-brand-soft": light.soft
    })}}`;
  }
});
</script>