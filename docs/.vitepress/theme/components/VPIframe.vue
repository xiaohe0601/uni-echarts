<template>
  <div class="vp-iframe">
    <iframe class="vp-iframe__inner" :src="href"></iframe>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vitepress";
import { computed } from "vue";

defineOptions({
  name: "VPIframe"
});

const route = useRoute();

const href = computed(() => {
  const link = `/pages${route.path}/index`;

  if (import.meta.env.DEV) {
    return `http://localhost:9861${link}`;
  }

  return `/ui${link}`;
});
</script>

<style scoped>
.vp-iframe {
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
  .vp-iframe {
    display: none;
  }
}

.vp-iframe__inner {
  width: 330px;
  height: 586px;
  border-width: 0;
}
</style>