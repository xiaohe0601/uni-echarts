<script lang="ts" setup>
import { onHide, onLaunch, onShow } from "@dcloudio/uni-app";

onLaunch(() => {
  // eslint-disable-next-line no-console
  console.log("App Launch");
});

onShow(() => {
  // eslint-disable-next-line no-console
  console.log("App Show");
});

onHide(() => {
  // eslint-disable-next-line no-console
  console.log("App Hide");
});
</script>

<style lang="scss">
@import "@/styles/palette.scss";
@import "@/styles/global.scss";
</style>