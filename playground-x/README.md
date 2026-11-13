# Uni ECharts x Playground

`playground-x` 是旧 `playground` 的 uni-app x / Vapor 复刻工程，用于同时验证
`uni-echarts-x` 和完整示例交互。

当前基线只把开发态、模拟器和开发者工具结果视为验收依据。编译成功或
`echarts.init()` 成功不等于平台兼容通过。

## 页面

| 页面 | 路径 | 主要能力 |
| --- | --- | --- |
| 首页 | `pages/index/index.uvue` | 11 个示例入口；回归页只保留直达路由 |
| 基础用法 | `pages/examples/basic/index.uvue` | 饼图、图例、richText tooltip |
| 异步数据 | `pages/examples/async-data/index.uvue` | 自定义主题、3 秒倒计时、Loading、数据刷新 |
| 动作调度 | `pages/examples/action-dispatch/index.uvue` | 高亮轮播、tooltip 事件 |
| 内置主题 | `pages/examples/builtin-theme/index.uvue` | Dark/Light 切换、Loading |
| 颜色渐变 | `pages/examples/gradient/index.uvue` | 双年份径向渐变散点图 |
| 弹窗内使用 | `pages/examples/popup/index.uvue` | 首次打开后常驻 Canvas；关闭时隐藏遮罩并给 popup 加 `display:none` |
| Pinia 集成 | `pages/examples/pinia-integration/index.uvue` | UTS 响应式 store、雷达图、Picker、增减按钮 |
| 图表联动 | `pages/examples/connectable/index.uvue` | 双实例、group 联动开关 |
| 手动更新 | `pages/examples/manual-update/index.uvue` | 20,000 点、dataZoom、toolbox restore |
| 自定义 Tooltip | `pages/examples/custom-tooltip/index.uvue` | `showtip/hidetip` 页内浮层 |
| 保存为图片 | `pages/examples/export-image/index.uvue` | `toTempFilePath()`；App 系统预览，H5 页内预览 |
| Canvas 兼容回归 | `pages/regression/index.uvue` | 尺寸、触摸、生命周期、双实例和导出 |

## 准备

在仓库根目录安装 workspace 依赖（`playground-x` 已纳入 pnpm workspace）：

```sh
pnpm install
```

然后生成 `uni_modules`：

```sh
pnpm build:uni-x
```

生成目录为：

```text
playground-x/uni_modules/xiaohe-echarts-x
```

该目录是构建产物，不提交。

一键执行构建、单测、类型检查和产物校验：

```sh
pnpm check:uni-x
```

## 构建与运行

已验证工具链：

- HBuilderX/HBuilderV `5.33.2026102115-alpha`
- ECharts `6.1.0`
- Android 14 AVD
- iOS 17.2 Simulator
- HarmonyOS API 20 Simulator
- 微信开发者工具 Stable `2.02.2609250`

详细环境、命令和证据边界见
[`docs/plans/uni-app-x-compatibility.md`](../docs/plans/uni-app-x-compatibility.md)。

### Android Vapor

可见 AVD 必须冷启动，并隔离旧的 Emulator 崩溃报告数据库，否则模拟器可能停在
`CrashConsentProvider::requestConsent`，看起来像“没有启动模拟器”：

```sh
ANDROID_EMU_CRASH_REPORTING_DATABASE=/tmp/uni-echarts-x/emu-crash-clean \
  "$HOME/Library/Android/sdk/emulator/emulator" \
  -avd Pixel_3a_API_34_extension_level_7_arm64-v8a \
  -port 5556 \
  -no-audio \
  -no-boot-anim \
  -no-snapshot-load \
  -gpu swiftshader_indirect
```

编译、安装并启动：

```sh
/Applications/HBuilderV-Alpha.app/Contents/Resources/app/bin/cli launch app-android \
  --project "$(pwd)" \
  --deviceId emulator-5556 \
  --vaporRenderTarget bytecode \
  --cleanCache true
```

如果命令停在 `Connect to HBuilder successfully` 后不再推进，先用 ADB 核对设备，不要直接
判定“模拟器没有启动”。本轮 `emulator-5556` 一直在线，应用也已实际安装和启动；失败点是
HBuilder 调试器侧的设备发现和调试资源交接没有进入新产物。HBuilder SDK 日志在
21:08:04、21:11:53、21:13:27 均出现
`CapabilityDisabledError: 禁用写入 launch.json 配置`，21:11:53 还出现旧设备项
`emulator-5554` 的 `getMobileList-skip-device ... reason: 'Timeout'`。处理方式是使用
项目名 `playground-x` 重新 `cli open`，清理 ADB reverse，force-stop 基座，重启
HBuilderX SDK host 后重新执行 `launch app-android`。恢复后的日志应包含“蒸汽模式”
“视图层编译目标：字节码”“编译成功”和“同步手机端程序文件成功”。诊断时可检查：

```sh
ADB="$HOME/Library/Android/sdk/platform-tools/adb"
"$ADB" devices -l
"$ADB" -s emulator-5556 shell pidof io.dcloud.uniappx
```

软件渲染的可见 AVD 可能明显卡顿、跳帧，必要时应用进程会被系统重启。首次导航或弹窗首开
可能等待数秒；应以 ADB 设备、前台 Activity 和新 PID 判断，不要把卡顿误判成模拟器未启动。

## 验收结果

| 平台 | 首页 / 11 示例 / 回归页 | 本轮交互 | 结论 |
| --- | --- | --- | --- |
| Android Vapor | 11 示例 + 回归页首帧通过 | 完整 Demo 主链路、容器宽度 autoresize、action-dispatch 轮播、gradient、Pinia Picker/增减、custom tooltip、导出预览通过 | 完整 Demo 通过；release APK 已构建/验签（需在最终提交重建），运行时、真机未验证 |
| iOS 17.2 Vapor | 11 示例 + 回归页首帧通过 | SimulatorKit HID 真实 tap/drag：tooltip、异步 Loading、主题、弹窗开关/二次打开、Pinia Picker/增减、联动拖拽/断开、dataZoom/restore、自定义 tooltip、系统导出预览、autoresize 和原生滚动重绘 | 完整 Demo 主链路通过；XCUITest 受当前主机 entitlement 阻塞；release/真机未验证 |
| HarmonyOS API 20 Vapor | 11 示例 + 回归页首帧通过 | `uitest uiInput` 真实点击/拖拽覆盖首页、11 示例主链路和回归页生命周期、双实例、原生触摸、scroll-view 重绘 | 首页、11 示例和回归页通过；release/真机未验证 |
| H5 production VDOM | 13 路由全部通过 | 常驻弹窗、Pinia Picker、visualMap 双向联动、dataZoom/restore、页内导出预览和窗口 autoresize 通过 | 非 Vapor；桌面鼠标未接入 |
| 微信小程序 x | 13 页首帧通过 | CDP 坐标触摸完成 11 示例主链路；回归页调用原生 `scroll-view.scrollTo()` 后重绘；异步、主题/Loading、弹窗、Pinia、联动开关、restore、tooltip、系统导出预览通过 | `0` exception / `0` console error；游客 AppID，Picker/手势拖拽未穷举 |

Android 完整 Demo 已实际操作：

- 主题 Dark/Light 与 Loading。
- 异步数据倒计时和 3 秒 Loading 遮罩。
- 弹窗尺寸按 `(getWindowWidth() / 750) * 32 * 20` 计算，Android `390px` 视口约为
  `332.8x332.8`，HarmonyOS `376px` 视口约为 `320.86x320.86`。Canvas 首次打开后常驻，
  关闭时隐藏遮罩并让 popup 进入 `display:none`，二次打开正常恢复。
- Pinia Picker、增加/减少和禁用态。
- 双图联动开关与关闭后的隔离。
- 手动更新页 dataZoom 拖拽与 toolbox Restore；证据为
  `android-final/09-manual-update-current.png`、`09-manual-update-zoom.png` 和
  `09-manual-update-restore.png`。
- 自定义 tooltip 显示 `Search Engine：1048`，空白触摸隐藏。
- 导出图片并打开 `uni.previewImage`，显示 `1 / 1`。
- 回归页主图容器宽度 `300px -> 240px -> 300px` 时 Canvas 自动重排，无需手工调用
  `resize()`。
- `basic` 示例在系统窗口宽度 `1080 -> 800 -> 1080` 时图例换行、Canvas 和饼图同步
  重排；证据为 `android-final/autoresize-basic-1080.png`、
  `autoresize-basic-w800.png` 和 `autoresize-basic-restored.png`。
- 清理临时诊断代码后的最终冒烟证据位于 `/tmp/uni-echarts-x/final-smoke-android/`；
  首页、基础页、弹窗首次打开/关闭/二次打开和手动更新 dataZoom/restore 均通过，
  `logcat` crash buffer 为空，未再出现临时诊断标记。
- 2026-11-12 晚间完整 Demo 复测证据位于
  `/tmp/uni-echarts-x/android-final-recheck/`：`action-dispatch` tooltip 轮播、
  `gradient`、Pinia Picker 选择 `Defense` 与增加/减少、`custom-tooltip`
  显示/隐藏、`export-image` 系统预览均实际操作通过。21:09-21:16 又复验弹窗
  首次打开/关闭/二次打开和导出系统预览，证据为
  `/tmp/uni-echarts-x/android-popup-recheck-{initial2,open,closed,reopen}.png` 和
  `android-export-recheck-preview3.png`。21:30 复核时 `emulator-5556` 仍在线，
  应用 PID `29603`，前台 `UniAppActivity`，crash buffer 为空。
- 22:21 以箭头视觉修正后的代码重新执行 Vapor bytecode 编译安装，日志
  `/tmp/uni-echarts-x/android-arrow-launch.log` 明确包含“蒸汽模式”“视图层编译目标：
  字节码”“13 个页面”“编译成功”和“同步手机端程序文件成功”。复验首页、`basic`、
  弹窗开关/二次打开、Pinia Picker 选择 `Defense` 与增减均通过；应用 PID `30336`，
  crash buffer 仍为空，证据为 `/tmp/uni-echarts-x/android-arrow-*.png`。

不能把首帧、程序化 action 或 `scrollTo()` 的结果扩展成完整手指手势通过。

## H5

H5 production 是 **VDOM**，不是 Vapor。已验证产物位于：

```text
playground-x/unpackage/dist/build/web
```

production 验收包括：

- 首页、11 个示例和回归页共 13 条路由可达；首页不显示“开发验收”。
- 11 条示例路由直达，非弹窗页 Canvas 非空；回归页两个实例分别为 `300x200` 和
  `240x160`。
- 普通示例 Canvas 为 `390x312` CSS、backing `780x624`；`async-data`、`gradient`、
  `connectable` 为 `390x249.59` CSS、backing `780x499`。
- 当前 production 交互审计的 CDP 异常和控制台错误为空。
- 弹窗首次打开后生成 `665x665` backing、`332.8x332.8` CSS 的非空 Canvas；关闭时
  Canvas 保留且图像哈希不变，遮罩隐藏、popup 进入 `display:none`、布局尺寸变为
  `0x0`；二次打开复用同一实例和同一图像哈希。
- 异步 Loading、主题/Loading、自定义开关、Pinia 增加/减少与 Picker 提交通过。
  Picker 拖拽脚本未改变选项，改用 CDP 点击可见的 `Defense` 后提交成功；证据为
  `/tmp/uni-echarts-x/h5-arrow-picker-click.json`。
- 当前 production 产物上补测联动：开启时拖动第一图 visualMap，两图同步变化；关闭后
  拖动第二图，第一图保持不变、第二图变化；证据为
  `/tmp/uni-echarts-x/h5-arrow-interactions/report.json`。
- dataZoom 拖动改变图形，toolbox restore 后 Canvas 哈希恢复到初始值。
- 自定义 tooltip、页内导出预览和触摸链路通过。
- H5 没有可用的 `uni.previewImage`，导出页改为页内预览；真实 PNG data URL 加载成功，
  无捕获错误。
- 浏览器窗口宽度 `1080 -> 600 -> 1080` 时 Canvas 自动 resize，页面无捕获异常。
- production 产物先由本机 uni-app x SDK 编译到
  `/tmp/uni-echarts-x/h5-prod-arrow-221300`，再同步到
  `playground-x/unpackage/dist/build/web`。`cli publish web` 仍要求登录，属于发行门禁，
  不是编译失败；构建日志为 `/tmp/uni-echarts-x/h5-prod-arrow.log`。上一轮产物
  `/tmp/uni-echarts-x/h5-prod-rebuild-212413` 仅保留作对照。
- 13 路由证据为
  `/tmp/uni-echarts-x/h5-arrow-routes-metrics.json`；完整交互记录为
  `/tmp/uni-echarts-x/h5-arrow-interactions.log`，结构化报告为
  `/tmp/uni-echarts-x/h5-arrow-interactions/report.json`。
- 首页、弹窗和 Pinia 的箭头容器已与旧版对齐；H5 绘制结果与 Android、HarmonyOS、
  iOS 最新截图均确认 `❯` 字形正常。

## HarmonyOS

已验证 API 20 模拟器：

```sh
/Applications/HBuilderV-Alpha.app/Contents/Resources/app/bin/cli launch app-harmony \
  --project "$(pwd)" \
  --deviceId 127.0.0.1:5555 \
  --vaporRenderTarget bytecode \
  --cleanCache true \
  --native-log false
```

设备验收可使用 HDC，不依赖 macOS 窗口坐标：

```sh
HDC=/Applications/DevEco-Studio.app/Contents/sdk/default/openharmony/toolchains/hdc
"$HDC" -t 127.0.0.1:5555 shell "snapshot_display -f /data/local/tmp/chart.jpeg"
"$HDC" -t 127.0.0.1:5555 file recv \
  /data/local/tmp/chart.jpeg /tmp/chart.jpeg
```

容器宽度 autoresize 已实测：主图从 `300x200` 缩到 `240x200` 时，Canvas 从
`1050x700` 变为 `840x700`，DPR 保持 `3.5/3.5`；恢复后回到 `1050x700`，渲染计数从 `#2`
增加到 `#3`。截图见 `/tmp/uni-echarts-x/harmony-autoresize-w240.jpeg` 和
`harmony-autoresize-restored.jpeg`。

最终清理版关键回归证据位于 `/tmp/uni-echarts-x/final-smoke-harmony/`：异步数据
Loading/刷新、主题 Light/Loading、弹窗打开/关闭/二次打开、联动 visualMap 同步与
断开关闭后的隔离、手动更新 dataZoom/restore 均已实际操作通过。弹窗另有
`/tmp/uni-echarts-x/harmony-popup-recheck-{initial,open,closed,reopen}.jpeg`；
关闭时 popup 进入 `display:none`，Canvas 常驻。

2026-11-12 晚间补充交互证据位于 `/tmp/uni-echarts-x/harmony-final-recheck/`：
`action-dispatch` 高亮轮播（`01-action-rotate-1.png` 至 `01-action-rotate-3.png`）、
`gradient`、Pinia Picker 选择 `Defense` 与增加/减少、`custom-tooltip` 显示/隐藏、
`export-image` 系统预览 `1 / 1` 均通过。复核结束时 PID 仍为 `27602`。导出适配补丁后
于 21:26-21:27 再次点按“保存为图片”，系统预览仍为 `1 / 1`，复验时 PID 为 `31983`；
证据为 `/tmp/uni-echarts-x/harmony-export-recheck-initial.jpeg` 和
`harmony-export-recheck-preview.jpeg`。

22:28-22:32 又以当前箭头代码完成 HAP 编译安装，应用 PID 为 `18476`。首页箭头、
弹窗页和弹窗打开、Pinia 页面、Picker 选择 `Defense` 均通过；证据为
`/tmp/uni-echarts-x/harmony-arrow-{home,popup-page,popup-open,pinia,picker,pinia-picked}.jpeg`。

## iOS

已验证基线为 iPhone 15 Pro / iOS 17.2 / Xcode Simulator：

```sh
/Applications/HBuilderV-Alpha.app/Contents/Resources/app/bin/cli launch app-ios \
  --project "$(pwd)" \
  --iosTarget simulator \
  --deviceId 3600F23E-6B31-4154-8766-77D24BD0B9A6 \
  --vaporRenderTarget bytecode \
  --cleanCache true \
  --native-log true
```

2026-11-13 以 Vapor bytecode 启动最新 `playground-x`，应用 PID `40633`。在
iPhone 15 Pro / iOS 17.2 上完成首页、11 个示例和回归页的真实 HID tap/drag 验收：

- `basic` tooltip、`async-data` Loading/刷新、`action-dispatch` 高亮轮播、
  `builtin-theme` 主题/Loading、`gradient` 首帧、`popup` 打开/关闭/二次打开、
  `pinia-integration` Picker/增减、`connectable` 联动拖拽/断开、
  `manual-update` dataZoom/restore、`custom-tooltip` 显示/隐藏和
  `export-image` 系统预览 `1 / 1` 均通过。
- 回归页通过真实 tap/drag 覆盖三种图表、更新、尺寸、容器宽度 `autoresize`、
  显式 resize、销毁/重建、`v-if` 卸载/重挂载、Tooltip、Loading、导出、
  手动更新、双实例和原生 scroll-view 重绘。
- 首帧为 `300x200 / 900x600 / DPR 3`；容器缩窄到 `240` 时为
  `240x200 / 720x600`，恢复后回到 `300x200 / 900x600`。导出 `dataURL`
  长度 `64058`，主图最终 `rendered #63`，第二实例 `second rendered #9`。
- 验收日志未命中组件 `[uni-echarts-x] error` 或 FATAL，进程 `40633` 保持存活。

权威证据位于 `/tmp/uni-echarts-x/ios-final-v1/`，摘要为 `summary.json`，回归日志为
`launch-regression-root-observer2.log`。

当前 macOS 27.2.1 + Xcode 16.2 上，XCUITest 受 AMFI/`DTServiceHub`
entitlement/first-launch 问题阻塞。本轮使用 SimulatorKit HID helper 直接向已启动模拟器
发送 tap/drag，源码为 `/tmp/uni-echarts-x/ios-ui-tests/simhid.swift`，可执行文件为
`/tmp/uni-echarts-x/ios-ui-tests/bin/simhid`。这是真实模拟器输入，不是页面 handler
代点；早期 mouse/pointer HID 调查中的 `backboardd` abort 只保留为历史记录，本轮未新增
同类报告。

iOS 17.4 对照设备仍在上游 GCanvas 渲染阶段崩溃，因此当前基线固定为 iOS 17.2。
release/TestFlight、真机和其他 Xcode/runtime 组合尚未验证。

## 微信小程序

已编译到：

```text
playground-x/unpackage/dist/dev/mp-weixin
```

自动化和 DevTools 验收：

```sh
/Applications/wechatwebdevtools.app/Contents/MacOS/cli auto \
  --project "$(pwd)/unpackage/dist/dev/mp-weixin" \
  --auto-port 9334 --trust-project --lang zh
```

小程序 Automator 连接：

```js
const automator = require("miniprogram-automator")
const miniProgram = await automator.connect({
  wsEndpoint: "ws://127.0.0.1:9334",
})
```

两个必须注意的 DevTools 限制：

- `touristappid` 会弹出“更改 AppID 失败 touristappid / Error: tourist appid”；
  这是 AppID 环境问题，不是组件异常。
- `miniProgram.screenshot()` 不包含 Canvas 图层，返回白色页面。验收 Canvas
  必须使用 DevTools 窗口截图，例如 macOS 的 `screencapture -l <windowId>`。

本轮微信完成 13 页首帧真实 Canvas，并用 83 步 CDP
`Emulation.setTouchEmulationEnabled` + `Input.dispatchTouchEvent` 在可见模拟器坐标
完成 11 个示例主链路：

- `basic` 点按扇区显示 tooltip；`async-data` 点击更新后出现 Loading/倒计时并刷新；
  `action-dispatch` 高亮轮播变化；`builtin-theme` Light/Loading；
  `gradient` 首帧；`popup` 首次打开、关闭、二次打开；
  `pinia-integration` 增加/减少；`connectable` 联动开关；
  `manual-update` toolbox Restore；`custom-tooltip` 点按显示、空白点按隐藏；
  `export-image` 系统图片预览 `1 / 1`。
- 回归页调用原生 `scroll-view.scrollTo()`，日志出现
  `[uni-echarts-x] regression scroll refresh` 并重新渲染。这是程序化原生滚动，
  不是手指惯性拖拽。
- 运行时审计为 `0` exception、`0` console error；`20` 条 warning 均来自
  `touristappid`、Vue 开发提示、`wx.getSystemInfoSync` 弃用和页面切换时已 disposal
  实例提示。

权威证据位于 `/tmp/uni-echarts-x/wx-goal-final-v4/`，摘要为同目录 `summary.json`；
回归日志为 `/tmp/uni-echarts-x/wx-final-v4-regression.jsonl`。

仍有限制：`touristappid` 会弹出“更改 AppID 失败 touristappid / Error: tourist appid”，
这是 AppID 环境问题，不是组件异常；`miniProgram.screenshot()` 不包含 Canvas 图层，
验收 Canvas 必须使用 DevTools 窗口截图。Picker 的独立物理手势、visualMap/dataZoom
手指拖动和 tooltip 触摸命中尚未形成穷举矩阵；未使用真实 AppID，也未做上传/体验版验收。

## 已知限制

- `autoresize` 只负责跟随可观测的容器宽高，默认高度仍由 `height` 显式指定；没有独立的
  横竖屏监听或内容高度推导。平台不提供 `UniResizeObserver` 时回退到显式 `resize()`。
- 示例同时传入 `height` 和 `custom-style: height:600rpx/480rpx` 时，`height` 是初始化
  fallback，后置的内联 `custom-style` 按 CSS 顺序覆盖它。这是旧 playground
  `h-75/h-60` 的等价复刻：H5 390px 视口为 `312px`，HarmonyOS 376px 视口约
  `300.8px`，不是尺寸错位。
- 旧站点的 Wot Design Uni、UnoCSS 没有直接移植。
- “Pinia 集成”使用等价 UTS 响应式 store；官方 Pinia 暂不支持 UTS。
- 弹窗为了规避 Android Vapor 重新插入 Canvas 后 `@ready` 不触发的问题，首次打开后会保留
  Canvas，关闭时隐藏遮罩并让 popup 进入 `display:none`；这会增加一个图表实例的常驻内存，
  页面退出时才释放。
- 微信主链路已用 CDP 坐标触摸验收；Picker 独立手势、visualMap/dataZoom 手指拖动和
  tooltip 触摸命中尚未穷举，且仍使用 `touristappid`。
- HTML tooltip、SVG renderer 和依赖离屏 canvas 的能力仍受限。
- `toTempFilePath()` 已验证；ECharts toolbox `saveAsImage`/`dataView` 仍需单独验证。
- iOS 17.4 仍有上游 GCanvas 崩溃，当前基线固定为 iOS 17.2。
- iOS 自动化依赖 SimulatorKit HID；XCUITest 受当前 macOS/Xcode entitlement 阻塞，
  升级工具链后需要复测。
- Android release APK 已构建并通过 v1/v2 签名验证，但该产物构建于本次 workspace/CI 改动前，最终提交前需重新构建；尚未安装运行。iOS IPA、HarmonyOS HAP、微信真实 AppID、上传发布和真机均未验证。

## 验收规则

1. 编译、初始化、首帧、交互、生命周期和导出分别记录。
2. 模拟器/开发者工具必须实际启动，不能只用构建结果代替。
3. H5 VDOM 不能证明 App Vapor。
4. 微信自动化截图白屏时先检查 Canvas 图层是否被截图工具遗漏。
5. 首帧、程序化 action 和 `scrollTo()` 不能写成完整手指交互通过。

本机证据图保存在 `/tmp/uni-echarts-x/`，未纳入仓库；Android 当前证据使用
`android-final/home-reset.png`、`android-final/01-basic.png` 至
`android-final/11-export-image.png` 及同目录交互截图，另有
`android-final-recheck/`、`android-popup-recheck-*.png` 和
`android-arrow-*.png`、`android-export-recheck-preview3.png`；HarmonyOS 另有
`harmony-final-recheck/`、`harmony-arrow-*.jpeg` 和 `harmony-export-recheck-*.jpeg`；
H5 当前构建为 `h5-prod-arrow-221300`、`h5-arrow-routes-metrics.json`、
`h5-arrow-interactions.log`、`h5-arrow-interactions/report.json` 和
`h5-arrow-picker-click.json`；iOS 权威证据为 `ios-final-v1/`，HID helper 为
`ios-ui-tests/simhid.swift`；HarmonyOS 权威证据为 `harmony-final-v2/`；微信权威证据为
`wx-goal-final-v4/` 和 `wx-final-v4-regression.jsonl`。其余历史证据包括
`android-demo-*.png`、`harmony-demo-*.jpeg`、`harmony-autoresize-*.jpeg`、
`ios-demo-*.png`、`ios-hid-*.png` 和 `wx-interactions/`。
