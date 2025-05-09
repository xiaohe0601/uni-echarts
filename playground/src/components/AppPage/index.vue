<template>
  <wd-config-provider class="app-page" :theme="theme">
    <slot></slot>

    <wd-toast></wd-toast>
    <wd-notify></wd-notify>
    <wd-message-box></wd-message-box>
  </wd-config-provider>
</template>

<script lang="ts" setup>
import type { Slots } from "./types";

defineOptions({
  name: "AppPage",
  options: {
    virtualHost: true
  }
});

defineSlots<Slots>();

const { theme } = useTheme();
</script>

<style lang="scss" scoped>
.app-page {
  position: relative;
}
</style>