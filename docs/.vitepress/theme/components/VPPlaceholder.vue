<template>
  <svg class="VPPlaceholder">
    <defs>
      <pattern
        id="pattern-5c1e4f0e-62d5-498b-8ff0-cf77bb448c8e"
        x="0"
        y="0"
        width="10"
        height="10"
        patternUnits="userSpaceOnUse"
      >
        <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3"></path>
      </pattern>
    </defs>

    <rect
      stroke="none"
      fill="url(#pattern-5c1e4f0e-62d5-498b-8ff0-cf77bb448c8e)"
      width="100%"
      height="100%"
    ></rect>
  </svg>
</template>

<script lang="ts" setup>

</script>

<style scoped>
.VPPlaceholder {
  display: block;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 10px;
  opacity: 0.8;
  stroke: var(--vp-c-divider);
}
</style>