<template>
  <div v-if="features.length > 0" class="VPFriendly">
    <h1 class="title">
      友情链接
    </h1>

    <VPFeatures :features="features"></VPFeatures>
  </div>
</template>

<script lang="ts" setup>
import { VPFeatures } from "vitepress/theme";
import { computed, reactive } from "vue";
import { useFriendly } from "../composables/useFriendly";

const friendly = reactive(useFriendly());

const features = computed(() => {
  if (friendly.data == null) {
    return [];
  }

  return friendly.data.map((item) => ({
    ...item,
    icon: {
      src: item.icon
    }
  }));
});
</script>

<style scoped>
.VPFriendly {
  display: flex;
  flex-direction: column;
  margin-top: 50px;
}

.title {
  font-size: 24px;
  text-align: center;
}

.VPFeatures {
  margin-top: 50px;
}
</style>