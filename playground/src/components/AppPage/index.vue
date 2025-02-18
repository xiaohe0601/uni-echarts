<template>
  <wd-config-provider class="app-page" :theme="theme">
    <slot></slot>
  </wd-config-provider>
</template>

<script lang="ts" setup>
defineOptions({
  name: "AppPage",
  options: {
    virtualHost: true
  }
});

const { theme } = useTheme();
</script>

<style lang="scss" scoped>
.app-page {
  position: relative;
  font-family: var(--font-global);
  line-height: 1.25;
}
</style>