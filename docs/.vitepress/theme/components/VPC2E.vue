<template>
  <div class="VPC2E">
    <button
      class="button"
      :class="{ 'is-loading': state.loading }"
      :disabled="state.loading"
      @click="onTransformClick()"
    >
      <span v-if="!state.loading">转换 echarts.min.js</span>
      <span v-else class="spinner"></span>
    </button>

    <span v-if="state.error" class="message">{{ state.message }}</span>
  </div>
</template>

<script lang="ts" setup>
import { fileOpen } from "browser-fs-access";
import { reactive } from "vue";

const state = reactive({
  loading: false,
  error: false,
  message: ""
});

async function transform() {
  const file = await fileOpen({
    extensions: [".js"]
  });

  if (file.type !== "text/javascript") {
    state.error = true;
    state.message = "Invalid file.";
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    state.error = true;
    state.message = "File size must not exceed 10 MB.";
    return;
  }

  state.loading = true;
  state.error = false;
  state.message = "";

  const data = new FormData();
  data.set("file", file);

  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/c2e`, {
    method: "POST",
    body: data
  });

  state.loading = false;

  if (!res.ok) {
    state.error = true;

    const json = await res.json();
    state.message = json.message;
    return;
  }

  const blob = await res.blob();

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "echarts.esm.js";
  a.click();
  URL.revokeObjectURL(url);
}

function onTransformClick() {
  transform();
}
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.VPC2E {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 520px;
  overflow: hidden;
  font-size: 14px;
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
}

.button {
  display: flex;
  align-items: center;
  height: 44px;
  padding: 0 20px;
  font-size: 16px;
  line-height: 1;
  color: #ffffff;
  cursor: pointer;
  user-select: none;
  background-color: var(--vp-c-brand-2);
  border-radius: 6px;
  transition: transform 300ms ease-out;
}

.button.is-loading {
  background-color: transparent;
}

.button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.button:not(:disabled):hover {
  transform: translateY(-2px);
}

.button:not(:disabled):active {
  background-color: var(--vp-c-brand-1);
  transform: translateY(0);
}

.spinner {
  width: 28px;
  height: 28px;
  border: 2px solid var(--vp-c-brand-soft);
  border-top-color: var(--vp-c-brand-1);
  border-radius: 50%;
  animation: spin 800ms linear infinite;
}

.message {
  margin-top: 20px;
  color: var(--vp-c-danger-1);
}

.VPC2E::after {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  content: "暂未开放";
  background-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
}

html.dark .VPC2E::after {
  background-color: rgba(0, 0, 0, 0.6);
}
</style>