<template>
  <div class="VPIframe">
    <iframe class="iframe" :src="href"></iframe>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vitepress";
import { computed } from "vue";

const route = useRoute();

const href = computed(() => {
  return `${import.meta.env.VITE_UI_URL}/ui/pages${route.path}/index`;
});
</script>

<style scoped>
.VPIframe {
  position: fixed;
  display: flex;
  flex-direction: column;
  margin-left: -70px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
}

@media (width <= 1390px) {
  .VPIframe {
    display: none;
  }
}

.iframe {
  width: 330px;
  height: 586px;
  border-width: 0;
}
</style>