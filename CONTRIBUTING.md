# 贡献指南

你好！我们非常高兴你有兴趣为 Uni ECharts 做出贡献。
在提交你的贡献之前，请务必花一些时间阅读我们的[行为准则](https://github.com/xiaohe0601/.github/blob/main/CODE_OF_CONDUCT.md)，
以及与你要进行的贡献类型相关的部分：

- [Issue 指南](#issue-指南)
- [Pull Request 指南](#pull-request-指南)
- [开发指南](#开发指南)

## Issue 指南

- Issue 仅限用于缺陷报告和功能请求，不符合要求的 issue 将会被关闭。
- 如果希望讨论交流，可以在 [Discussions](https://github.com/xiaohe0601/uni-echarts/discussions) 中进行。
- 在创建 issue 前，请先搜索一下，可能已经有人报告过，或者在 dev 分支中已修复。
- 请检查该问题是否能在最新稳定版本的 Uni ECharts 中重现。
- 必须清晰描述重现问题的必要步骤。虽然我们很愿意帮忙，但没有明确重现步骤的情况下定位问题会非常耗时，并且不具可持续性。
- 仅使用最少的代码来重现异常行为，并明确说明实际与期望表现的差异。
- 没有明确重现步骤的问题将不会予以处理，如果某个标记为 `Need reproduce` 的问题在 10 天内没有收到作者的进一步信息，它将被关闭。
- 如果你的问题已经解决，但仍然是打开状态，请直接关闭它。如果是你自己解决的，希望你可以在评论中分享解决方案。
- 最重要的是，请保持耐心。Issue 不是付费支持，我们无法保证处理速度。
- 如果你的 issue 能够附带解决问题的 PR 将极大可能加快问题的处理速度。

## Pull Request 指南

1. Fork [此仓库](https://github.com/xiaohe0601/uni-echarts) 到自己的 Github 账户；
2. 将 fork 后的仓库 clone 到本地；
3. 从 `dev` 创建新的分支，分支可以按照 `feat/xxx`、`fix/xxx` 等规则命名；
4. 在新的分支进行编码并充分测试，然后提交代码，提交规范请参考 [Conventional Commits](https://www.conventionalcommits.org)；
5. 可以有多次提交，我们会在合并时压缩为单条；
6. 创建 Pull Request 到 `dev` 分支，如果有对应的 issue 请进行
[关联](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue)；
7. 简单清晰填写 PR 的标题和内容，描述你所做的事情。

## 开发指南

> [!NOTE]
> 前置条件：
> - PNPM >= 10.0
> - NodeJS >= 20

- 目录结构

  - packages/core：核心 Vue 组件，使用 js + dts 编写
  - packages/shared：组合式函数、工具方法、类型声明，使用 ts 编写
  - playground：演示项目
  - docs：文档

- 依赖安装

```shell
pnpm install
```

- 运行

```shell
# 运行到 Web 端
pnpm play:h5

# 运行到微信小程序端
pnpm play:mp-weixin
```

- 构建

```shell
# 构建 Uni ECharts
pnpm build

# 构建 Uni Modules
pnpm build:uni
```

- 代码检查

```shell
# eslint
pnpm lint

# eslint --fix
pnpm lint:fix

# tsc
pnpm lint:type
```

## 许可协议

提交代码即表示你同意该代码遵循本项目的 [MIT](./LICENSE) 协议。