<template>
  <wd-config-provider class="app-page" :theme="theme">
    <slot></slot>

    <wd-toast></wd-toast>
    <wd-notify></wd-notify>
    <wd-message-box></wd-message-box>
  </wd-config-provider>
</template>

<script lang="ts" setup>
defineOptions({
  options: {
    // #ifdef MP-WEIXIN || MP-ALIPAY
    virtualHost: true
    // #endif
  }
});

defineSlots<{
  default?: () => any;
}>();

const { theme } = useTheme();
</script>

<style lang="scss" scoped>
.app-page {
  position: relative;
}
</style>