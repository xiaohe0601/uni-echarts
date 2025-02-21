<template>
  <app-page>
    <wd-navbar :bordered="false" safe-area-inset-top></wd-navbar>

    <view class="flex flex-col items-center justify-center px-4 py-8">
      <wd-img class="w-20 h-20" src="https://oss.xiaohe.ink/images/uni-echarts.png"></wd-img>
      <text class="mt-5 text-2xl text-t1">Uni ECharts</text>
      <text class="mt-3 text-base text-t3">适用于 uni-app 的 Apache ECharts 组件</text>
    </view>

    <view class="px-4 py-6 bg-b1 rounded-t-3xl">
      <wd-cell-group border>
        <wd-cell title="基础用法" is-link to="/pages/examples/basic/index"></wd-cell>
        <wd-cell title="异步数据" is-link to="/pages/examples/async-data/index"></wd-cell>
        <wd-cell title="动作调度" is-link to="/pages/examples/action-dispatch/index"></wd-cell>
        <wd-cell title="内置主题" is-link to="/pages/examples/builtin-theme/index"></wd-cell>
        <wd-cell title="颜色渐变" is-link to="/pages/examples/gradient/index"></wd-cell>
        <wd-cell title="Pinia 集成" is-link to="/pages/examples/pinia-integration/index"></wd-cell>
        <wd-cell title="图表联动" is-link to="/pages/examples/connectable/index"></wd-cell>
        <wd-cell title="手动更新" is-link to="/pages/examples/manual-update/index"></wd-cell>
        <wd-cell title="自定义 Tooltip" is-link to="/pages/examples/custom-tooltip/index"></wd-cell>
        <wd-cell title="导出图片" is-link to="/pages/examples/export-image/index"></wd-cell>
      </wd-cell-group>

      <wd-gap height="0" safe-area-bottom></wd-gap>
    </view>
  </app-page>
</template>

<script lang="ts" setup>

</script>

<route type="home">
{
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "Uni ECharts"
  }
}
</route>