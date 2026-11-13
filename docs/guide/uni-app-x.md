# uni-app x 兼容版本

::: warning 实验状态
`uni-echarts-x` 目前处于兼容验证阶段，包版本为 `0.0.0`，并保持 `private`。
它尚未发布到 npm 或 DCloud 插件市场，请不要把 `uni-echarts-x@0.0.0` 当成稳定版本使用。
:::

## 版本边界

`uni-echarts-x` 和旧的 `uni-echarts` 是两个独立包：

- `uni-echarts` 当前版本为 `2.5.4`，对应 npm / uni_modules 的常规版本线。
- `uni-echarts-x` 当前版本为 `0.0.0`，是工作树中的实验版本。
- 不能用 `uni-echarts@2.5.4` 推导 x 的版本，也不能用 x 的 `0.0.0` 判断旧包版本。

uni-app x 没有脱离 HBuilderX/HBuilderV 的独立运行版本号；x 编译器和 Vapor 能力以
HBuilderX/HBuilderV SDK 版本为准。本轮验收基线为 `5.33.2026102115-alpha`。

## 版本矩阵

| 项目 | 当前基线 | 说明 |
| --- | --- | --- |
| `uni-echarts-x` | `0.0.0` | 实验版本，`private`，未发布 |
| uni-app x 编译器 | HBuilderX/HBuilderV `5.33.2026102115-alpha` | 本轮 Android、iOS、HarmonyOS、H5、微信验收基线 |
| Vapor | `vapor: true` | `playground-x/manifest.json` |
| 渲染目标 | `bytecode` | `vapor-render-target: bytecode` |
| ECharts | `6.1.0` | 实测版本；`uni-echarts-x` peer 要求 `>=6.1.0` |
| Vue | `3.4.38` | 实测版本；peer 要求 `>=3.3.0` |
| zrender | `6.1.0` | 实测版本；peer 要求 `>=6.1.0` |

## 平台基线

以下结果是开发态和模拟器/开发者工具的手工验收基线，不等同于正式发布支持：

| 目标 | 模式 | 本轮基线 | 状态 |
| --- | --- | --- | --- |
| Android App | Vapor / bytecode | Android 14 AVD | Debug 完整 Demo 通过 |
| iOS App | Vapor / bytecode | iPhone 15 Pro / iOS 17.2 | Debug 完整 Demo 通过；iOS 17.4 受上游 GCanvas 阻塞 |
| HarmonyOS App | Vapor / bytecode | HarmonyOS API 20 | Debug 完整 Demo 通过 |
| H5 | VDOM | HBuilderX production | 13 条路由通过；不是 Vapor |
| 微信小程序 x | 小程序运行时 | 微信开发者工具 `2.02.2609250` | 主链路通过；仍使用 `touristappid` |
| Release | Android APK | 签名 APK | 构建/验签通过，尚未安装运行；IPA/HAP 和正式发布未验证 |

## 获取方式

当前没有可用的 npm 或插件市场版本。请在仓库中生成 `uni_modules`：

```sh
pnpm install
pnpm check:uni-x
```

然后在 HBuilderX/HBuilderV 中打开 `playground-x`。具体设备启动、H5 和微信命令见
[`playground-x/README.md`](https://github.com/xiaohe0601/uni-echarts/blob/dev/playground-x/README.md)。

## 版本升级规则

- `uni-echarts-x` 在 `private` 移除并建立独立 release 流程前，不承诺 semver 兼容。
- x 的版本只以 `packages/core-x/package.json` 为准，不跟随 `uni-echarts` 自动升级。
- CI 使用 `pnpm check:uni-x` 校验构建、单测、类型和 `uni_modules` 元数据。
- 迁移到新的 HBuilderX/HBuilderV 或 GCanvas 版本后，必须重新跑目标端验收，不能只升级版本号。

完整的验收记录和已知限制见
[uni-app x 兼容规划与验收记录](/plans/uni-app-x-compatibility)。
