---
aside: false
---

<VPCodegen renderer="canvas"></VPCodegen>

<script setup>
import { inBrowser } from "vitepress";
import { defineAsyncComponent } from "vue";

const VPCodegen = inBrowser
  ? defineAsyncComponent(() => import("../.vitepress/theme/components/VPCodegen.vue"))
  : () => null;
</script>