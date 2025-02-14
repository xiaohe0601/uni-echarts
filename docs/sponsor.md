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

## 赞助

如果 Uni ECharts 对你有帮助，可以通过以下渠道自愿进行赞助。

<div :class="$style['sponsor-wrapper']">
  <img :class="$style['sponsor-image']" src="https://oss.xiaohe.ink/profile/sponsor-wechat.jpg" alt="Wechat Sponsor" />
  <img :class="$style['sponsor-image']" src="https://oss.xiaohe.ink/profile/sponsor-alipay.jpg" alt="Alipay Sponsor" />
</div>

### 名单

无论金额，我们铭记于心，感谢您的支持！

| 赞助者                                            | 金额    | 留言     | 日期         |
|------------------------------------------------|-------|--------|------------|
| 插件市场匿名用户                                       | ￥0.30 | -      | 2025-02-06 |
| [Ethan Yin](https://blog.csdn.net/qq_39370934) | ￥1.66 | 👍👍👍 | 2025-02-13 |

<script setup>
import { VPTeamMembers } from "vitepress/theme";

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
.sponsor-wrapper {
  display: flex;
  height: 380px;
  margin-top: 24px;
}

.sponsor-image {
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
}

.sponsor-image + .sponsor-image {
  margin-left: 20px;
}
</style>