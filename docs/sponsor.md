# 支持我们

介绍我们的开发团队和赞助方式。

## 团队成员

以下是 Uni ECharts 核心团队成员：

<VPTeamMembers size="small" :members="members" />

### 贡献者

感谢以下的小伙伴们为 Uni ECharts 发展做出的贡献！

<a href="https://github.com/xiaohe0601/uni-echarts/graphs/contributors" target="_blank">
  <img src="https://contributors.nn.ci/api?repo=xiaohe0601/uni-echarts" alt="Contributors" />
</a>

## 鼓励

如果 Uni ECharts 对你有帮助，可以通过以下渠道对我们表示鼓励：

- Star：[Github](https://github.com/xiaohe0601/uni-echarts)、[Gitee](https://gitee.com/xiaohe0601/uni-echarts)
- 收藏：[插件市场](https://ext.dcloud.net.cn/plugin?id=22035)

## 赞助

如果 Uni ECharts 对你有帮助，也可以通过以下渠道自愿进行赞助：

<div :class="$style['sponsor-wrapper']">
  <img :class="$style['sponsor-image']" src="https://oss.xiaohe.ink/profile/sponsor-wechat.jpg" alt="Wechat Sponsor" />
  <img :class="$style['sponsor-image']" src="https://oss.xiaohe.ink/profile/sponsor-alipay.jpg" alt="Alipay Sponsor" />
</div>

::: info 提示

支付时请通过如下格式备注：

- uni-echarts.website@id: 留言

  示例1：uni-echarts.github@xiaohe0601: 这个插件真好用！

  示例2：uni-echarts.csdn@xiaohe0601: 这个插件真好用！

- uni-echarts.id: 留言

  示例：uni-echarts.xiaohe0601: 这个插件真好用！

:::

### 名单

无论金额，我们铭记于心，感谢您的支持！

<table>
  <thead>
    <tr>
      <th>赞助者</th>
      <th>金额</th>
      <th>留言</th>
      <th>日期</th>
    </tr>
  </thead>
  <tbody>
    <template v-if="sponsors.data">
      <tr v-for="(item) in sponsors.data" :key="item.id">
        <td>
          <a v-if="item.url" :href="item.url" target="_blank">{{ item.name }}</a>
          <template v-else>{{ item.name }}</template>
        </td>
        <td>{{ `￥${item.amount}` }}</td>
        <td>{{ item.message || "-" }}</td>
        <td>{{ item.date }}</td>
      </tr>
    </template>
    <template v-else>
      <tr>
        <td :class="$style['text-center']" colspan="4">暂无数据</td>
      </tr>
    </template>
  </tbody>
</table>

<script setup>
import { VPTeamMembers } from "vitepress/theme";
import { reactive } from "vue";
import { useSponsors } from "./.vitepress/theme/composables/useSponsors";

const sponsors = reactive(useSponsors());

const members = [
  {
    avatar: "https://oss.xiaohe.ink/profile/avatar.jpg",
    name: "xiaohe0601",
    title: "Creator",
    links: [
      { icon: "github", link: "https://github.com/xiaohe0601" }
    ]
  }
];
</script>

<style module>
.text-center {
  text-align: center;
}

.sponsor-wrapper {
  display: flex;
  height: 380px;
  padding: 8px;
  margin-top: 16px;
  overflow-x: auto;
}

.sponsor-image {
  border-radius: 8px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
}

.sponsor-image + .sponsor-image {
  margin-left: 20px;
}
</style>