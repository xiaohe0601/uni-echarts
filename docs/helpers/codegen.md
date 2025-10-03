---
aside: false
---

<VPCodegen renderer="canvas"></VPCodegen>

<script setup>
import { inBrowser } from "vitepress";
import { defineAsyncComponent, h, useCssModule } from "vue";
import VPPlaceholder from "../.vitepress/theme/components/VPPlaceholder.vue";

const classes = useCssModule();

function CodegenPlaceholder() {
  return h(VPPlaceholder, { class: classes.placeholder });
}

const VPCodegen = inBrowser
  ? defineAsyncComponent({
      loader: () => import("../.vitepress/theme/components/VPCodegen.vue"),
      loadingComponent: CodegenPlaceholder,
      errorComponent: CodegenPlaceholder
    })
  : () => null;
</script>

<style module>
.placeholder {
  width: 100%;
  height: 616px;
}
</style>