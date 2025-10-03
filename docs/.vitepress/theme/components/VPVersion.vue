<template>
  <div class="VPVersion">
    <VPBadge class="badge" :text="pkg.version"></VPBadge>
  </div>
</template>

<script lang="ts" setup>
import VPBadge from "vitepress/dist/client/theme-default/components/VPBadge.vue";
import pkg from "../../../../package.json";
</script>

<style scoped>
.VPVersion {
  display: inline-block;
  margin-left: 8px;
  vertical-align: middle;
}
</style>