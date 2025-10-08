<template>
  <div class="VPC2E">
    <button @click="transform()">转换</button>
  </div>
</template>

<script lang="ts" setup>
import { fileOpen } from "browser-fs-access";

async function transform() {
  const file = await fileOpen({
    extensions: [".js"]
  });

  const data = new FormData();
  data.set("file", file);

  const res = await fetch("http://localhost:9863/api/c2e", {
    method: "POST",
    body: data
  });

  if (!res.ok) {
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
</script>

<style scoped>

</style>