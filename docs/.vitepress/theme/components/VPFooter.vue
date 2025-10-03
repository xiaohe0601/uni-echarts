<template>
  <footer v-if="theme.footer" class="VPFooter" :class="{ 'has-sidebar': hasSidebar }">
    <div class="container">
      <div class="netlify">
        <img class="netlify-icon" :src="netlifyIcon" alt="netlify">
        <span class="netlify-link">This site is powered by <a
          href="https://netlify.com"
          target="_blank">Netlify</a></span>
      </div>

      <div class="metadata">
        <p v-if="theme.footer.message" class="message" v-html="theme.footer.message"></p>
        <p v-if="theme.footer.copyright" class="copyright" v-html="theme.footer.copyright"></p>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { useData } from "vitepress";
import { useSidebar } from "vitepress/theme";
import { computed } from "vue";
import ICON_NETLIFY_DARK from "../assets/images/netlify-dark.svg";
import ICON_NETLIFY_LIGHT from "../assets/images/netlify-light.svg";

const { theme, isDark } = useData();
const { hasSidebar } = useSidebar();

const netlifyIcon = computed(() => {
  return isDark.value ? ICON_NETLIFY_DARK : ICON_NETLIFY_LIGHT;
});
</script>

<style scoped>
.VPFooter {
  position: relative;
  z-index: var(--vp-z-index-footer);
  padding: 32px 24px;
  background-color: var(--vp-c-bg);
  border-top: 1px solid var(--vp-c-gutter);
}

.VPFooter.has-sidebar {
  display: none;
}

.VPFooter :deep(a) {
  text-decoration-line: underline;
  text-underline-offset: 2px;
  transition: color 0.25s;
}

.VPFooter :deep(a:hover) {
  color: var(--vp-c-text-1);
}

@media (min-width: 768px) {
  .VPFooter {
    padding: 32px;
  }
}

.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: var(--vp-layout-max-width);
  margin: 0 auto;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.netlify {
  display: flex;
  align-items: center;
}

.netlify-icon {
  width: 26px;
  margin-right: 10px;
}

.metadata {
  line-height: 1.75;
  text-align: end;
}

@media (max-width: 767px) {
  .container {
    flex-direction: column;
  }

  .netlify {
    margin-bottom: 32px;
  }

  .metadata {
    text-align: center;
  }
}
</style>