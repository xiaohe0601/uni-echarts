<template>
  <DefaultTheme.Layout>
    <template #aside-top>
      <VPIframe v-if="iframeVisible"></VPIframe>
    </template>
  </DefaultTheme.Layout>
</template>

<script lang="ts" setup>
import { useData, useRoute } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { computed, nextTick, provide } from "vue";
import VPIframe from "./VPIframe.vue";

const route = useRoute();

const { isDark } = useData();

const iframeVisible = computed(() => {
  return route.path.startsWith("/examples");
});

function enableTransitions() {
  return "startViewTransition" in document
    && window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
}

provide("toggle-appearance", async ({ clientX: x, clientY: y }: MouseEvent) => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value;
    return;
  }

  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    )}px at ${x}px ${y}px)`
  ];

  await document.startViewTransition(async () => {
    isDark.value = !isDark.value;

    await nextTick();
  }).ready;

  document.documentElement.animate(
    { clipPath: isDark.value ? clipPath.reverse() : clipPath },
    {
      duration: 300,
      easing: "ease-in",
      pseudoElement: `::view-transition-${isDark.value ? "old" : "new"}(root)`
    }
  );
});
</script>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  mix-blend-mode: normal;
  animation: none;
}

::view-transition-old(root),
.dark::view-transition-new(root) {
  z-index: 1;
}

::view-transition-new(root),
.dark::view-transition-old(root) {
  z-index: 9999;
}

/* stylelint-disable-next-line selector-class-pattern */
.VPSwitchAppearance {
  width: 22px !important;
}

/* stylelint-disable-next-line selector-class-pattern */
.VPSwitchAppearance .check {
  transform: none !important;
}
</style>