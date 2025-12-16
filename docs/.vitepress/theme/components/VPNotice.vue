<template>
  <div v-if="visible && notice != null" class="VPNotice">
    <p class="text">
      {{ notice.text }}
    </p>

    <VPButton
      v-if="notice.button"
      theme="brand"
      :text="notice.button"
      :href="notice.link"
      @click="dismiss()"
    ></VPButton>

    <VPButton
      theme="alt"
      text="关闭"
      @click="dismiss()"
    ></VPButton>
  </div>
</template>

<script lang="ts" setup>
import { StorageSerializers, useStorage } from "@vueuse/core";
import { VPButton } from "vitepress/theme";
import { computed, reactive, shallowRef, watchEffect } from "vue";
import { useNotices } from "../composables/useNotices";

const notices = reactive(useNotices());

const notice = computed(() => {
  if (notices.data == null || notices.data.length === 0) {
    return null;
  }

  return notices.data[0];
});

const dismissedNoticeId = useStorage<number>(
  "uni-echarts.dismissed-notice-id",
  null,
  undefined,
  {
    serializer: StorageSerializers.number
  }
);

const visible = shallowRef(false);

function show() {
  visible.value = true;

  if (typeof window !== "undefined") {
    window.document.documentElement.classList.add("is-notice-visible");
  }
}

function dismiss() {
  visible.value = false;

  if (notice.value != null) {
    dismissedNoticeId.value = notice.value.id;
  }

  if (typeof window !== "undefined") {
    window.document.documentElement.classList.remove("is-notice-visible");
  }
}

function check() {
  if (notice.value == null || notice.value.id === dismissedNoticeId.value) {
    dismiss();
    return;
  }

  show();
}

watchEffect(() => {
  check();
});
</script>

<style>
@media (min-width: 960px) {
  html.is-notice-visible {
    --vp-layout-top-height: var(--vp-nav-height);
  }
}

@media (max-width: 959px) {
  html.is-notice-visible .VPNavScreen {
    top: 0;
  }
}
</style>

<style scoped>
.VPNotice {
  position: relative;
  top: 0;
  left: 0;
  z-index: var(--vp-z-index-nav);
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding: 12px;
  text-align: justify;
  background-color: var(--vp-nav-bg-color);
  border-bottom: 1px dashed var(--vp-c-gutter);
}

@media (min-width: 960px) {
  .VPNotice {
    position: fixed;
    flex-direction: row;
    align-items: center;
    height: var(--vp-nav-height);
    padding: 8px 32px;
  }

  .text {
    margin-right: auto;
  }
}
</style>