<template>
  <div class="VPC2E">
    <button @click="test()">测试</button>
  </div>
</template>

<script lang="ts" setup>
import { fileOpen } from "browser-fs-access";

async function test() {
  const blob = await fileOpen({
    extensions: [".js"]
  });

  const data = new FormData();
  data.append("file", blob);

  const res = await fetch("http://localhost:9863/api/c2e", {
    method: "POST",
    body: data
  });

  console.log(res);
}
</script>

<style scoped>

</style>