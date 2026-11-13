# uni-app x 兼容规划与验收记录（Vapor）

> 状态：兼容实现、完整 playground 复刻，以及 HarmonyOS API 20、iOS 17.2、微信开发者工具三端本轮验收已完成；Android release APK 已构建/验签，但构建于本次 P0 改动前、需重建，运行时、IPA/HAP 与正式发布未验证
>
> 工作分支：`codex/uni-app-x-compat`
>
> 基线：`5e57945`（`dev`）
>
> 基线版本：`uni-echarts@2.5.4`、ECharts `6.1.0`
> 更新日期：2026-11-13

## 1. 结论摘要

- 已新增独立 `packages/core-x`、`playground-x`、x 专用构建脚本和三组适配器单测，不修改旧 `packages/core` 入口。
- 旧 `playground` 的首页和 11 个示例已经复刻到独立 `playground-x`，没有修改旧 `playground`；x 工程另保留独立回归页。
- Android App Vapor debug bytecode 已在可见 AVD 上完成完整 Demo 验收：11 个示例首帧、容器宽度 `autoresize`、主题/加载、弹窗开关、Pinia 交互、图表联动、dataZoom/restore、自定义 tooltip 和导出预览均已实际操作通过。清理临时诊断代码后又完成了一次无诊断冒烟，首页、基础页、弹窗和手动更新主链路仍通过；2026-11-12 21:09-21:16 又复验了弹窗首次打开/关闭/二次打开和导出系统预览，21:30 审计时 PID 为 `29603`、前台为 `UniAppActivity`、crash buffer 为空。22:21 以当前箭头修正重新执行 Vapor bytecode 编译安装，13 页编译成功，复验首页、`basic`、弹窗开关和 Pinia Picker/增减，PID 为 `30336`，crash buffer 仍为空。
- Android 验收中的模拟器并非未启动：`emulator-5556` 一直在线，ADB 可识别设备，应用进程和前台 Activity 也实际存在。HBuilder SDK 日志在 21:08:04、21:11:53、21:13:27 均出现 `setProjectPlayground o [CapabilityDisabledError]: 禁用写入 launch.json 配置`，21:11:53 还记录了旧设备项 `emulator-5554` 的 `getMobileList-skip-device ... reason: 'Timeout'`。调试器侧的设备发现和资源交接因此可能停在旧基座；重新以项目名 `playground-x` 打开项目、清理 ADB reverse、force-stop 基座并重启 HBuilderX SDK host 后再 launch，才恢复“蒸汽模式”“视图层编译目标：字节码”“编译成功”和“同步手机端程序文件成功”。这是调试资源交接问题，不是模拟器未启动。
- iOS 17.2 App Vapor 已在 2026-11-13 完成首页、11 个示例和回归页真实交互：tooltip、异步 Loading/刷新、高亮轮播、主题/Loading、弹窗开关/二次打开、Pinia Picker/增减、联动拖拽/断开、dataZoom/restore、自定义 tooltip 和系统导出预览均通过；回归页还覆盖三种图表、`autoresize`、显式 resize、销毁/重建、卸载/重挂载、双实例和原生滚动重绘。XCUITest 受 macOS 27.2.1 + Xcode 16.2 的 AMFI/`DTServiceHub` entitlement 问题阻塞，本轮改用 `SimulatorKit` HID helper 的 tap/drag，完成的是真实模拟器输入，不是页面 handler 代点。
- HarmonyOS App Vapor 已在 2026-11-13 完成首页、11 个示例和回归页最新源码验收。回归页通过真实 `uitest uiInput click/drag` 覆盖图表类型、更新、尺寸、容器宽度 autoresize、显式 resize、销毁/重建、卸载/重挂载、tooltip、Loading、导出、手动更新、双实例、原生触摸和 scroll-view 重绘；组件 error/FATAL 为 0。
- H5 production 产物为 **VDOM**，已完成首页、11 个示例和回归页的 13 路由真实 Canvas 验收，并实际操作通过异步 Loading、主题/Loading、Pinia Picker 提交、常驻 Canvas 弹窗生命周期、visualMap 联动与断开隔离、dataZoom/restore、自定义 tooltip、页内导出预览和窗口 `autoresize`。uni-app x 的 H5 运行时当前没有可用的 `uni.previewImage`，导出页使用页内预览，不能写成“H5 Vapor 通过”。
- 视觉复刻已完成一轮 390×844、DPR 2 的新旧首页逐页对比。稳定页面的整页差异为 `basic 0.565%`、`builtin-theme 0.685%`、`popup 0.018%`、`custom-tooltip 0.184%`、`export-image 0.377%`、`pinia 0.918%`；随机数据页不能直接用整页像素差判断布局。首页、弹窗和 Pinia 的箭头容器坐标/尺寸已对齐，`❯` 字形在 Android、HarmonyOS、iOS 和 H5 均正常显示。
- 微信小程序 x 已在微信开发者工具 `2.02.2609250` 完成 13 个页面（首页、11 个示例、回归页）的首帧真实 Canvas 截图。最新一轮用 CDP
  `Emulation.setTouchEmulationEnabled` + `Input.dispatchTouchEvent` 在可见模拟器坐标完成
  基础用法 tooltip、异步 Loading/刷新、主题/Loading、弹窗开关/二次打开、Pinia 增减、联动开关、
  manual restore、自定义 tooltip 和导出系统预览；回归页调用原生
  `scroll-view.scrollTo()` 后出现 `regression scroll refresh` 并重绘。运行时为 `0`
  exception、`0` console error。项目仍使用 `touristappid`，并保留 DevTools AppID
  报错弹窗；Picker 独立物理手势和 visualMap/dataZoom 手指拖动仍属专项缺口。
- Android release APK 已构建并完成 v1/v2 签名验证，但该产物构建于本次 P0 改动前，最终提交前需要重建；尚未安装运行。iOS/HarmonyOS release、微信真实 AppID 和正式上传发布仍未验证。
- 当前结论只代表开发态样例与模拟器验收，不代表 npm、插件市场或 release 包已经可发布。
- 2026-11-13 的本轮验收以 HarmonyOS API 20、iOS 17.2 和微信开发者工具 `2.02.2609250`
  为三端权威证据。Android 没有在本轮重新启动模拟器，旧 Android 结果只作为历史完整 Demo
  证据，不混入本轮三端结论。
- iOS 17.2 已用 SimulatorKit HID 完成首页、11 个示例和回归页的真实点击/拖拽验收，不再
  是“仅首帧”。XCUITest 在当前 macOS 27.2.1 + Xcode 16.2 上受
  AMFI/`DTServiceHub` entitlement 问题阻塞，HID helper 是本次实际验收通道。
- HarmonyOS 已完成首页、11 个示例和回归页真实点击/拖拽，覆盖原生 scroll-view 重绘、
  `native:touchstart/touchend`、`zr:click`、双实例和生命周期；组件 error 与 FATAL 均为 0。
- 微信开发者工具最新一轮使用 CDP 坐标触摸完成 11 个示例主链路和回归页原生
  `scroll-view.scrollTo()` 重绘，`0` exception、`0` console error；仍使用
  `touristappid`，不是正式 AppID 验收。

## 2. 目标与边界

### 2.1 目标

1. 为 uni-app x 提供独立的 ECharts 组件和 Canvas/事件/DPR/导出适配层。
2. 保持旧 `uni-echarts`、`xiaohe-echarts` 与现有平台入口不变。
3. App 端使用 Vapor 原生 Canvas 2D；H5 使用 VDOM；微信小程序 x 使用小程序运行时。
4. 将“编译、初始化、真实渲染、交互、生命周期、导出”分别记录，不用一项结果替代另一项。

### 2.2 非目标

- 不把 ECharts 或 zrender 改写成 UTS。
- 不注入假 DOM，不用 HTML tooltip 模拟原生能力。
- 不以 H5 VDOM 或微信编译成功证明 App Vapor 通过。
- 当前不承诺完全自动的宽高、横竖屏 resize，SVG、HTML tooltip、复杂手势、dataZoom/brush 全量交互或依赖离屏 canvas 的能力。`autoresize` 只覆盖可观测的容器尺寸变化。

## 3. 已落地架构

### 3.1 目录

```text
packages/core-x/
  src/
    components/uni-echarts-x/uni-echarts-x.uvue
    adapters/
      canvas.ts
      touch.ts
    runtime/
      environment.ts
      events.ts
      options.ts

playground-x/
  pages/index/index.uvue
  pages/regression/index.uvue
  pages/examples/basic/index.uvue
  pages/examples/async-data/index.uvue
  pages/examples/action-dispatch/index.uvue
  pages/examples/builtin-theme/index.uvue
  pages/examples/gradient/index.uvue
  pages/examples/popup/index.uvue
  pages/examples/pinia-integration/index.uvue
  pages/examples/connectable/index.uvue
  pages/examples/manual-update/index.uvue
  pages/examples/custom-tooltip/index.uvue
  pages/examples/export-image/index.uvue
  shared/demo.ts
  static/uni-echarts.png
  manifest.json
  pages.json
  index.html
  main.uts

scripts/build-uni-x.ts
test/core-x-canvas.test.ts
test/core-x-touch.test.ts
test/core-x-options.test.ts
```

`packages/core-x` 不经过旧 `packages/shared` barrel，避免把 DOM、旧 `CanvasContext`、旧页面生命周期和自动 resize 依赖带入 x 运行时。

### 3.2 Canvas host

ECharts 接收普通 JS host，而不是直接接收原生 `UniCanvasElement`：

- host 不暴露 `nodeName`，强制 zrender 使用 single-canvas 路径。
- host 同步逻辑尺寸和原生 backing 尺寸。
- `getContext("2d")` 委托给 `createCanvasContextAsync()` 返回的 2D context。
- 原生事件由适配器显式归一化后派发给 zrender。
- `getDom()` 返回 host，而不是原生 canvas 元素。

### 3.3 尺寸与 DPR

初始化顺序：

1. `@ready` 与 `onMounted` 进入同一个幂等状态机。
2. 获取 2D context 和原生 canvas。
3. 读取逻辑布局尺寸和设备 DPR。
4. 写入原生 backing 尺寸。
5. 用 `nativeCanvas.width / logicalWidth` 反推实际 render DPR，并限制在 `0.5..8`。
6. 使用 `renderer: "canvas"`、`useDirtyRect: false` 初始化 ECharts。

本轮实测：

| 平台 | 逻辑尺寸 | backing 尺寸 | DPR | 证据边界 |
| --- | --- | --- | --- | --- |
| Android 回归页 | `300x200` | `825x550` | `2.75 / 2.75` | 宽高变化与恢复已动态验证 |
| iOS 17.2 回归页 | `300x200` | `900x600` | `3 / 3` | 首帧、尺寸切换、容器宽度 autoresize、显式 resize 和恢复均已真实操作验证 |
| iOS 17.2 回归页缩窄 | `240x160` | `720x480` | `3 / 3` | `toggleSize`；容器宽度 `240` 时为 `240x200 / 720x600` |
| HarmonyOS API 20 回归页 | `300x200` | `1050x700` | `3.5 / 3.5` | 首帧与最终恢复均验证 |
| HarmonyOS 回归页缩窄 | `240x160` | `840x560` | `3.5 / 3.5` | 尺寸与显式 resize 已验证；容器宽度从 `240` 恢复到 `300` 时为 `300x160 / 1050x560` |
| H5 production 回归页 | `300x200` | 同逻辑尺寸 | `1 / 1` | 窗口 `1080 -> 600 -> 1080`，缩窄后逻辑尺寸与 canvas 同步变化 |
| 微信小程序 x 回归页 | `300x200` | `900x600` | `3 / 3` | 13 页首帧；原生 `scrollTo()` 后重绘已记录，动态宽度 autoresize 未专项验收 |

### 3.4 初始化与生命周期

已实现：

- `idle -> pending -> ready -> disposed/idle` 状态收敛。
- `@ready` 与 `onMounted` 双入口幂等。
- 1 秒上下文请求超时、最多 20 次重试。
- 卸载后忽略迟到的 context 回调。
- `dispose()` 后允许重新初始化。
- 显式 `dispose()` 使尚未返回的上下文请求失效。
- deferred option 只应用一次。
- 页面或应用隐藏期间不启动新初始化；恢复后重新测量布局、按需 resize 并刷新。
- 隐藏期间变化的 `option` 在恢复后应用最新 props。
- 退出手动更新模式时恢复 props 自动更新。
- DPR 变化时重建实例，避免 backing 与 zrender DPR 失配。

已实现宽度 `autoresize`：

- `autoresize` 为 `true` 时，根节点宽度使用 `100%`，高度仍由 `height` 显式指定。
- 初始化后通过 `UniResizeObserver` 观察原生 Canvas；尺寸变化做 50ms 防抖，再调用
  `resize({ width, height })`。
- 平台未暴露 `UniResizeObserver` 时静默降级，仍可使用 `props.width/height`、`visible`
  或显式 `resize()`。
- 没有独立的页面横竖屏监听，也没有基于内容高度的自动推导；不能把当前实现表述为
  “完全自动尺寸”。

Android、iOS、HarmonyOS 和 H5 已做真实动态宽度验证。iOS 同时保留
`UniResizeObserver` 和 100ms `getBoundingClientRect()` 轮询兜底，回归页实测
`300x200 -> 240x200 -> 300x200`，backing 同步为 `900x600 -> 720x600 -> 900x600`。
微信本轮完成首帧和原生 scroll-view 重绘，但没有单独做动态宽度验收。

### 3.5 触摸与 Tooltip

- 原生触摸归一化为 `touchstart/touchmove/touchend/touchcancel`。
- 坐标支持 `clientX/clientY`、`pageX/pageY`、`x/y`，并减去 canvas 偏移。
- 触摸释放点相对按下点在 x/y 任一轴上的位移不超过 10px 时合成 zrender `click`；不限制按压时长。
- 顶层和 series 级 tooltip 强制 `renderMode: "richText"`。
- 不创建假 `document`，不支持 HTML formatter。
- iOS 使用 SimulatorKit HID 的真实 tap/drag，HarmonyOS 使用
  `uitest uiInput click/drag`，微信使用 CDP 坐标触摸；三端都观察到真实输入而非仅调用
  页面方法。iOS/HarmonyOS 日志分别出现原生触摸与 `zr:click`，微信回归页观察到原生
  scroll-view `@scroll` 后的 `regression scroll refresh`。

### 3.6 导出与全局平台 API

zrender `setPlatformAPI()` 是模块级全局状态，不能绑定到某个实例。当前做法：

- `createCanvas` 只创建独立浏览器 canvas；原生端没有浏览器 document 时抛出明确错误。
- `getDataURL()` 直接读取当前图表 canvas，不调用 ECharts `renderToCanvas()`。
- H5 支持 `type`、`quality`、`backgroundColor`、`pixelRatio` 合成。
- App 当前通过 `UniCanvasElement.toDataURL()` 返回当前 canvas。
- 文本测量维护存活上下文注册表；销毁一个实例后不会把全局 API 指向失效 context。

### 3.7 环境修正

- 建立 `globalThis.global` 别名，兼容 ECharts/zrender 的 Node 分支引用。
- 运行时将 zrender `env.node`、`worker`、`wxa` 置为 `false`，`domSupported`、`svgSupported` 置为 `false`。
- 不依赖 `playground-x/App.uvue` 的临时全局补丁。
- Android Emulator 可见窗口启动前隔离崩溃报告数据库：

```sh
ANDROID_EMU_CRASH_REPORTING_DATABASE=/tmp/uni-echarts-x/emu-crash-clean \
  emulator -avd Pixel_3a_API_34_extension_level_7_arm64-v8a \
  -port 5556 -no-audio -no-boot-anim -no-snapshot-load \
  -gpu swiftshader_indirect
```

旧崩溃报告会触发模拟器自身的 CrashConsent `QDialog`，主线程停在
`CrashConsentProvider::requestConsent -> QDialog::exec()`，看起来像“模拟器没有启动”。
隔离报告数据库后可见窗口正常冷启动；这是 AVD 环境问题，不是组件崩溃。

本轮完整 Demo 验收中还遇到另一条独立现象：HBuilder CLI 向基座下发调试资源时交接卡住。
CLI 输出 `Connect to HBuilder successfully` 后不再推进，基座停留在旧资源，随后调试连接
被断开。此时 `emulator-5556`、ADB 设备和应用进程实际都存在，失败点是调试资源交接，不是
模拟器缺失。处理方式是结束卡住的 CLI，停止旧 HBuilderX SDK host，清理 ADB reverse，
重启 host 后重新执行 Vapor launch；恢复后的日志确认“蒸汽模式”“视图层编译目标：字节码”
“项目 playground-x 编译成功”和“同步手机端程序文件成功”。

可见 AVD 使用软件渲染时还会出现明显卡顿、跳帧，必要时应用进程会被系统重启。验收时应
结合 ADB 设备状态、前台 Activity 和新 PID 判断，不能把卡顿或重启误记为“模拟器没有
启动”。

### 3.8 完整 playground 复刻

`playground-x` 以旧 `playground` 的首页和示例结构为基准，同时保留独立的
`pages/regression/index.uvue` 作为底层能力回归页。

| 旧 playground 页面 | playground-x 页面 | 复刻说明 |
| --- | --- | --- |
| 首页 | `pages/index/index.uvue` | 保留 11 个示例入口；回归页只保留直达路由，不在首页展示 |
| 基础用法 | `pages/examples/basic/index.uvue` | 饼图、图例、richText tooltip |
| 异步数据 | `pages/examples/async-data/index.uvue` | 自定义主题、3 秒倒计时、Loading 遮罩、数据刷新 |
| 动作调度 | `pages/examples/action-dispatch/index.uvue` | 高亮轮播、tooltip 事件与 Vapor action 派发 |
| 内置主题 | `pages/examples/builtin-theme/index.uvue` | Dark/Light 切换、Loading 开关与背景适配 |
| 颜色渐变 | `pages/examples/gradient/index.uvue` | 双年份径向渐变散点图 |
| 弹窗内使用 | `pages/examples/popup/index.uvue` | 自定义遮罩替代 `wd-popup`，首次打开后常驻 Canvas；关闭时隐藏遮罩并给 popup 加 `display:none` |
| Pinia 集成 | `pages/examples/pinia-integration/index.uvue` | 使用等价 UTS 响应式 store；官方 Pinia 暂不支持 UTS |
| 图表联动 | `pages/examples/connectable/index.uvue` | 双实例、`group` 联动开关与隔离验证 |
| 手动更新 | `pages/examples/manual-update/index.uvue` | 20,000 点、`manualUpdate`、dataZoom 与 toolbox restore |
| 自定义 Tooltip | `pages/examples/custom-tooltip/index.uvue` | `showtip/hidetip` 驱动页内自定义浮层 |
| 保存为图片 | `pages/examples/export-image/index.uvue` | 新增 `toTempFilePath()`；App 优先 `uni.previewImage`，H5 直接页内预览 |

视觉层没有引入旧站点的 Wot Design Uni 和 UnoCSS，改为在 `.uvue` 中写等价布局与样式。
尺寸策略：

- 11 个示例均开启 `autoresize`，图表根节点宽度跟随页面容器。
- 高度仍由示例显式指定：普通示例使用 `600rpx`（390px 视口为 `312px`），
  `async-data`、`gradient` 和 `connectable` 使用 `480rpx`（390px 视口为
  `249.59375px`），不依赖内容或屏幕方向自动推导。
- 示例同时传入的 `height` 是初始化 fallback；`custom-style` 拼在根节点内联样式末尾，
  因而按 CSS 顺序覆盖 `height`。旧版 `h-75/h-60` 经过 uni-app rem 折算后与
  `600rpx/480rpx` 等价，这不是优先级错误。HarmonyOS 376px 视口下 `600rpx`
  约为 `300.8px`。
- 弹窗示例的尺寸由 `getLegacyHeight(20)` 计算：
  `(getWindowWidth() / 750) * 32 * 20`。宽度为 `390px` 的 Android 视口约为
  `332.8px`，宽度为 `376px` 的 HarmonyOS 视口约为 `320.86px`。
- 回归页提供“容器宽度”按钮，可在 `300px -> 240px -> 300px` 间切换，验证
  `UniResizeObserver -> resize()` 链路。
- Android、iOS、HarmonyOS 和 H5 已实测宽度自适应；微信只有首帧和原生 scroll-view
  重绘证据，动态宽度未专项验收。

视觉对齐补充（2026-11-12）：

- 以旧 H5 的 `390×844`、DPR 2 截图为基准，旧/新普通页 Canvas 均为 `390×312` CSS、
  backing `780×624`；`async-data`、`gradient`、`connectable` 均为
  `390×249.59375` CSS；弹窗 body 均为 `332.8×332.8`，位置约
  `x=28.6, y=255.6`。
- 首页和弹窗的右侧箭头改为与旧 Wot Design 视觉接近的 `❯`：容器 `18×24`，首页
  新/旧横坐标均为 `340.375`，弹窗均为 `x=357, y=54`；Pinia 的箭头容器均为
  `x=359, y=374.3125, 16×24`。H5 实测首页箭头墨迹约 `15×23` 物理像素，
  Pinia 约 `12×19`。
- 稳定页面剩余差异主要来自 Canvas 文本抗锯齿和字体栅格化，不是 Canvas/CSS 尺寸
  错位。渐变、联动、手动更新等随机数据页不把整页像素差直接解释为布局不等。

弹窗示例在首次打开动画后约 `220ms` 挂载图表；关闭弹窗时遮罩切为 `opacity: 0`、
`z-index: -1`，同时给 popup 加 `display:none`，但不卸载 Canvas。
这是相对旧 `wd-popup`（关闭后卸载）的兼容折中：Android Vapor 动态移除后重新插入 Canvas
时曾出现 `@ready` 不触发、异步 context 连续超时，因此首次打开后保留 Canvas，用透明度和
`z-index` 控制遮罩。页面退出时仍随组件正常卸载。Pinia 示例只在页面文案中保留“Pinia
集成”名称，实际状态管理是 UTS 响应式 store，不是把浏览器版 Pinia 强行注入 Vapor。

## 4. 构建与工具链

根脚本：

```sh
pnpm check:uni-x
```

也可以分开执行：

```sh
pnpm build:uni-x
pnpm test:x
pnpm type-check:x
pnpm verify:uni-x
```

`build:uni-x` 将 `packages/core-x/src` 复制为：

```text
playground-x/uni_modules/xiaohe-echarts-x
```

该目录是生成产物，已忽略提交。当前包版本为 `0.0.0`，未发布 npm 或插件市场；
`packages/core-x` 在具备独立发布流程前保持 `private`，并已从通用 release 发布范围排除。
CI 的 `uni-x` 作业执行 `pnpm check:uni-x`，发布作业发布时显式排除 `uni-echarts-x`。

本轮工具链：

| 项目 | 版本/环境 |
| --- | --- |
| HBuilderX/HBuilderV SDK | `5.33.2026102115-alpha` |
| Android 调试基座 | `5.33.101358` |
| Android 系统 | Android 14，`1080x2220`，density `440` |
| iOS 模拟器 | iPhone 15 Pro，iOS 17.2；Xcode 16.2；另保留 iOS 17.4 对照 |
| HarmonyOS 模拟器 | API 20，`1316x2832` |
| 微信开发者工具 | `2.02.2609250`，已登录，CDP `9334`，`touristappid` |
| ECharts | `6.1.0` |

H5 production 通过 HBuilderX 内置 uni-app x 编译器直接构建。仓库默认产物位于：

```text
playground-x/unpackage/dist/build/web
```

本轮 production 产物先由本机 uni-app x SDK 编译到
`/tmp/uni-echarts-x/h5-prod-arrow-221300`，再同步到仓库产物目录；日志为
`/tmp/uni-echarts-x/h5-prod-arrow.log`，包含“Compiler version: 5.33（uni-app x）
VDOM模式”和 `DONE Build complete.`。上一轮产物
`/tmp/uni-echarts-x/h5-prod-rebuild-212413` 作为对照保留。H5 是 VDOM，
不是 Vapor。`cli publish web` 仍被“此功能需要先登录”拦截，这是发行登录门禁，不是编译
失败；本轮没有把登录阻断写成发布通过。

## 5. 平台验收

### 5.1 总览

| 平台 | 编译 | 初始化 | 真实渲染 | 交互 | 生命周期 | 导出 | 结论 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Android App Vapor debug bytecode | 通过 | 通过 | 通过 | 完整 Demo + autoresize 通过 | 通过 | 通过 | 完整 Demo 通过；release APK 已构建/验签，运行时未验证 |
| iOS 17.2 App Vapor bytecode | 通过 | 通过 | 通过 | 首页、11 示例和回归页真实 HID 点击/拖拽通过 | 通过 | 通过 | 完整 Demo 通过，release/真机未验证 |
| iOS 17.4 App Vapor bytecode | 通过 | 启动崩溃 | 不适用 | 不适用 | 不适用 | 不适用 | 上游 GCanvas 阻塞 |
| HarmonyOS API 20 App Vapor bytecode | 通过 | 通过 | 通过 | 首页、11 示例和回归页真实点击/拖拽通过 | 通过 | 通过 | 完整 Demo 与最新回归页通过，release/真机未验证 |
| H5 production VDOM | 通过 | 通过 | 通过 | 11 示例页面 + 常驻弹窗/Picker/visualMap/dataZoom 等关键交互通过 | 页面级通过 | 通过 | 13 路由通过，非 Vapor |
| 微信小程序 x | 通过 | 通过 | 通过 | 13 页首帧 + 11 示例主链路 CDP 坐标触摸 + 回归页原生滚动重绘 | 通过 | 系统预览通过 | DevTools 验收通过；游客 AppID，Picker/拖拽专项仍有限 |

### 5.1.1 完整 Demo 本轮验收矩阵

| 平台 | 首页 + 11 示例可达 | 首帧真实 Canvas | 本轮额外交互 | 证据边界 |
| --- | --- | --- | --- | --- |
| Android Vapor | 通过 | 11 页均通过 | 容器 autoresize、主题/Loading、弹窗开关、Pinia、联动开关、dataZoom/restore、自定义 tooltip、导出预览 | 完整 Demo 主链路通过；release APK 已构建/验签，运行时、真机未验证 |
| iOS 17.2 Vapor | 通过 | 11 页均通过 | tooltip、异步 Loading/刷新、高亮轮播、主题/Loading、弹窗开关/二次打开、Pinia Picker/增减、联动拖拽/断开、dataZoom/restore、自定义 tooltip、系统导出预览；回归页全链路 | SimulatorKit HID 真实 tap/drag；XCUITest 受 AMFI/`DTServiceHub` 阻塞；release/真机未验证 |
| HarmonyOS API 20 Vapor | 通过 | 11 页均通过 | 容器 autoresize、tooltip、导出、异步 Loading、主题/Loading、弹窗、联动、dataZoom/restore、action-dispatch、gradient、Pinia；回归页生命周期、双实例、原生触摸与 scroll-view 重绘 | `uitest uiInput` 真实点击/拖拽；组件 error/FATAL 为 0；release/真机未验证 |
| H5 production VDOM | 通过 | 13 路由可达，11 个示例页均通过 | 异步 Loading、主题/Loading、Pinia 数值与 Picker、常驻弹窗打开/关闭/二次打开、visualMap 联动与断开隔离、dataZoom/restore、tooltip 与页内导出预览 | VDOM，不是 Vapor；桌面鼠标仍未接入 |
| 微信小程序 x | 13 页（含回归页）通过 | 13 页均通过 | 基础 tooltip、异步 Loading/刷新、主题/Loading、弹窗开关/二次打开、Pinia 增减、联动开关、manual restore、自定义 tooltip、导出系统预览、回归页原生滚动重绘 | CDP 坐标触摸；`0` exception / `0` console error；`captureScreenshot` 不含 Canvas，使用 DevTools 窗口截图 |

验收截图和窗口图保存在 `/tmp/uni-echarts-x/`，未纳入仓库。三端本轮权威证据目录：

- iOS：`/tmp/uni-echarts-x/ios-final-v1/`，结构化摘要为同目录 `summary.json`，
  回归日志为 `launch-regression-root-observer2.log`。
- HarmonyOS：`/tmp/uni-echarts-x/harmony-final-v2/`，结构化摘要为同目录
  `summary.json`，回归日志为 `launch-regression.log`。
- 微信：`/tmp/uni-echarts-x/wx-goal-final-v4/`，结构化摘要为同目录 `summary.json`；
  回归页日志为 `/tmp/uni-echarts-x/wx-final-v4-regression.jsonl`。

Android 完整示例和交互证据在 `/tmp/uni-echarts-x/android-final/`：首页为
`home-reset.png`，示例为 `01-basic.png` 至 `11-export-image.png`；主题/Loading、
弹窗、Pinia、联动、tooltip 和导出预览另有 `04-*`、`06-*`、`07-*`、`08-*`、`10-*`、
`11-*` 文件；`manual-update` 的 dataZoom/restore 使用 `09-manual-update-current.png`、
`09-manual-update-zoom.png` 和 `09-manual-update-restore.png`。宽度自适应使用同目录的
`autoresize-basic-1080.png`、`autoresize-basic-w800.png` 和
`autoresize-basic-restored.png`。2026-11-12 晚间复测证据在
`/tmp/uni-echarts-x/android-final-recheck/` 和
`/tmp/uni-echarts-x/harmony-final-recheck/`：分别覆盖 `action-dispatch` tooltip
轮播、`gradient`、Pinia Picker/增减、`custom-tooltip` 显示/隐藏和 `export-image`
系统预览。

### 5.2 Android App Vapor

环境：`Pixel_3a_API_34_extension_level_7_arm64-v8a`，`emulator-5556`，可见窗口冷启动。

本轮完整 Demo 验收已重新以 Vapor bytecode 编译并安装 13 页工程，启动日志包含
“进程 13 个页面”“编译成功”和“进入页面：pages/index/index”。随后在可见 AVD 上逐页
操作，而不是复用旧核心回归页截图。

关于“安卓验收没有启动模拟器”：该判断不准确。`emulator-5556` 全程在线，ADB 能列出
`device`，应用也实际安装并启动。弹窗复验时应用 PID 为 `29304`；2026-11-12 21:30
再次审计时 PID 为 `29603`，`topResumedActivity` 为 `UniAppActivity`，crash buffer
为空。历史交接故障期间也仍有应用进程和前台 Activity。

HBuilder SDK 日志进一步显示了调试器侧的两个环境问题：

- 21:08:04、21:11:53、21:13:27 均出现
  `setProjectPlayground o [CapabilityDisabledError]: 禁用写入 launch.json 配置`。
- 21:11:53 出现旧设备发现项
  `getMobileList-skip-device ... udid: 'emulator-5554' ... reason: 'Timeout'`；19:57:25
  也有同类记录。

因此问题不是 `emulator-5556` 不存在，而是 HBuilderX 侧的设备发现/调试资源交接没有进入
新一轮 Vapor 产物。恢复方式是使用项目名 `playground-x` 重新 `cli open`，清理 ADB
reverse，force-stop 基座，重启 HBuilderX SDK host 后再 launch；成功日志包含“蒸汽模式”
“视图层编译目标：字节码”“项目 playground-x 编译成功”和“同步手机端程序文件成功”。
这不是组件运行时失败。

已通过：

- 首页仅显示 11 个示例入口；“Canvas 兼容回归”作为第 13 条路由直达，不出现在首页。
- `basic`：真实环形饼图。
- `async-data`：真实柱状图；点击“更新数据”后出现 `请稍候...` 遮罩和倒计时，
  约 3 秒后数据刷新且遮罩消失。
- `action-dispatch`：高亮轮播和 richText tooltip。
- `builtin-theme`：Dark 首帧、切 Light、切回 Dark，并验证 Loading。
- `gradient`：双年份径向渐变散点图。
- `popup`：打开后真实饼图；尺寸按设备窗口宽度计算，Android `390px` 视口约为
  `332.8x332.8`，HarmonyOS `376px` 视口约为 `320.86x320.86`；关闭时隐藏遮罩并让
  popup 进入 `display:none`，Canvas 首次打开后常驻，二次打开快速恢复。
- `pinia-integration`：雷达图、对象 Picker、增加/减少和禁用态。
- `connectable`：双图渲染；关闭联动开关后操作第一图，第二图保持不变。
- `manual-update`：20,000 点、dataZoom 拖拽和 toolbox Restore；证据为
  `android-final/09-manual-update-current.png`、`09-manual-update-zoom.png` 和
  `09-manual-update-restore.png`。
- `custom-tooltip`：扇区触摸显示 `Search Engine：1048`，空白触摸隐藏。
- `export-image`：生成真实图片并打开 `uni.previewImage`，显示 `1 / 1`。
- 折线、柱状、饼图真实绘制。
- props 自动更新、手动更新模式与手动应用。
- 固定尺寸变化、显式 `resize()`。
- 原生触摸进入 `zr:click`，richText tooltip 命中。
- Loading 开关、导出、`dispose()`、重建、`v-if` 卸载/挂载。
- 双实例更新、更新全部、销毁第一实例后第二实例继续更新。
- 切后台再回前台后图表保留，更新和导出仍正常。
- 示例页使用旧 playground 的 `600rpx` / `480rpx` 高度策略，普通页为 `312px`，
  `async-data`、`gradient`、`connectable` 为 `249.6px`（按 `390px` 逻辑宽度折算）。
- `basic` 示例通过系统窗口宽度 `1080 -> 800 -> 1080` 触发容器宽度变化，图例换行、
  Canvas 和饼图同步重排；截图保存在 `android-final/autoresize-basic-1080.png`、
  `autoresize-basic-w800.png` 和 `autoresize-basic-restored.png`。
- 回归页单独记录固定尺寸指标：首帧 `300x200`、`canvas 825x550`、DPR
  `2.75/2.75`；缩窄后 `240x160`、`canvas 660x440`，DPR 保持 `2.75/2.75`。
- 导出 `dataURL: 20746`；第二实例更新触发 `second rendered #2`。
- 清理版最终冒烟后应用进程仍存活，`logcat` 的 crash buffer 为空，未发现应用 FATAL。
  软件渲染 AVD 会跳帧和变慢，因此不写“无 ANR”的绝对结论。

清理临时诊断代码后的最终 Android 冒烟证据位于
`/tmp/uni-echarts-x/final-smoke-android/`：首页、`basic` 首帧、弹窗首次打开/关闭/二次
打开、手动更新 dataZoom/restore 均有截图。冒烟期间未再出现 `requestCanvas`、
`canvasContext`、`touch`、`unmounted` 等临时标记。软件渲染下首次导航和弹窗首开明显偏慢，
例如基础页首帧约 6 到 8 秒、弹窗首次 Canvas 约 19 秒；同进程等待后均成功渲染，弹窗二次
打开约 3 秒恢复。该延迟与可见 AVD 的软件渲染和调试基座有关，不能据此判定模拟器未启动。

2026-11-12 晚间又在同一 `emulator-5556` 上补做完整 Demo 复测：`action-dispatch`
tooltip 轮播、`gradient` 双年份径向渐变、Pinia Picker 选择 `Defense` 与增加/减少、
`custom-tooltip` 显示/隐藏、`export-image` 系统预览 `1 / 1` 均实际操作通过，证据在
`/tmp/uni-echarts-x/android-final-recheck/`。21:09-21:11 的弹窗二次复验证据为
`android-popup-recheck-initial2.png`、`android-popup-recheck-open.png`、
`android-popup-recheck-closed.png` 和 `android-popup-recheck-reopen.png`；21:16 的导出
系统预览为 `android-export-recheck-preview3.png`。复核结束再次检查：`adb devices` 仍为
`device`，应用 PID `29603`，前台 `UniAppActivity`，`logcat -b crash` 为空。

22:21 为箭头视觉修正重新执行 Vapor bytecode 编译安装，日志
`/tmp/uni-echarts-x/android-arrow-launch.log` 明确包含“蒸汽模式”“视图层编译目标：
字节码”“当前工程 13 个页面”“编译成功”“同步手机端程序文件成功”和“应用
【playground-x】已启动”。复验时首页、弹窗页、弹窗首次打开/关闭/二次打开、Pinia
Picker 选择 `Defense`、增加按钮和 `basic` 饼图均通过；设备仍为 `emulator-5556`，
PID `30336`，crash buffer 为空。证据为 `/tmp/uni-echarts-x/android-arrow-*.png`。

未验证：

- Android release APK 的安装运行与真机验证。
- 真机。
- 桌面级悬停、滚轮和复杂手势。

### 5.3 iOS App Vapor

设备：iPhone 15 Pro，iOS 17.2，UDID
`3600F23E-6B31-4154-8766-77D24BD0B9A6`。

2026-11-13 使用 HBuilder CLI 以 Vapor bytecode 启动最新 `playground-x`，应用 PID
`40633`，首页、11 个示例和回归页都在 iOS 17.2 模拟器上完成了真实 HID 输入。权威证据
目录为 `/tmp/uni-echarts-x/ios-final-v1/`，结构化摘要为 `summary.json`，回归日志为
`launch-regression-root-observer2.log`。

已通过：

- 首页和 11 个示例均真实渲染，并在各自主链路上完成输入：
  `basic` 点按扇区显示 tooltip；`async-data` 点击更新后出现 Loading/倒计时并刷新；
  `action-dispatch` 高亮轮播连续变化；`builtin-theme` 切换 Light、Dark 和 Loading；
  `gradient` 显示双年份径向渐变；`popup` 首次打开、遮罩关闭和二次打开；
  `pinia-integration` 打开 Picker 选择并执行增加/减少；`connectable` 拖动 visualMap
  并断开联动；`manual-update` 拖动 dataZoom 后 Restore；`custom-tooltip` 点按扇区
  显示并在空白处隐藏；`export-image` 打开系统图片预览 `1 / 1`。
- 回归页通过真实 tap/drag 验证折线/柱状/饼图、更新数据、尺寸变化、容器宽度
  `autoresize`、显式 Resize、销毁/重建、`v-if` 卸载/重挂载、Tooltip 显示/隐藏、
  Loading、`getDataURL()`、手动更新/应用手动、第二实例更新、更新全部和原生
  scroll-view 拖动后的重绘。
- Vapor bytecode 首帧 `300x200`、`canvas 900x600`、DPR `3/3`。
- 尺寸切换后为 `240x160 / 720x480 / DPR 3`；容器宽度 `240` 时为
  `240x200 / 720x600`；恢复后回到 `300x200 / 900x600`。
- 导出 `dataURL` 长度为 `64058`；主图最终 `rendered #63`，第二实例
  `second rendered #9`；原生 scroll-view 刷新后主图和第二图均重新渲染。
- 组件 `[uni-echarts-x] error` 为 `0`，验收后没有新的 `UniAppX`
  FATAL/crash 报告；进程 `40633` 保持存活。

自动化输入：

- 当前 macOS 27.2.1 + Xcode 16.2 上，XCUITest 因 AMFI/`DTServiceHub`
  entitlement/first-launch 问题不可用，`AXIsProcessTrusted()` 也不可用于稳定的
  System Events/CGEvent 注入。
- 本轮改用 SimulatorKit HID helper，直接向已启动模拟器发送 tap/drag。源码为
  `/tmp/uni-echarts-x/ios-ui-tests/simhid.swift`，可执行文件为
  `/tmp/uni-echarts-x/ios-ui-tests/bin/simhid`；调用形式为
  `simhid tap X Y` 和 `simhid drag X1 Y1 X2 Y2`。
- 该通道完成了多步点击、拖拽和滚动，不再沿用 2026-11-12 私有 mouse HID 调查中
  `backboardd` abort 的失败路径；早期 `backboardd-*.ips` 只保留为调查记录，不作为本轮
  失败证据。

iOS 17.4 对照设备：

- UDID `81D624AB-15A1-417E-B256-0DCD78186555`。
- 启动后上游 GCanvas 线程崩溃，历史栈包含
  `GCanvasContext::ClipRegion`、`GCanvasWeex::Render`、
  `GCanvasRenderScheduler run`。
- 因此结论是“iOS 17.2 可运行；iOS 17.4 有上游崩溃”，不是“全部 iOS 不支持”。

未验证：

- iOS release/TestFlight 包。
- iOS 真机。
- 其他 Xcode/runtime 组合上的 XCUITest 可复现性；本轮验收依赖 SimulatorKit HID。
- 更新 HBuilderX/GCanvas 后的 17.4 复测。

### 5.4 HarmonyOS App Vapor

环境：DevEco Studio 6.0.0.858、HarmonyOS API 20、模拟器
`127.0.0.1:5555`。

构建与启动：

```sh
cli launch app-harmony \
  --project "$(pwd)/playground-x" \
  --deviceId 127.0.0.1:5555 \
  --vaporRenderTarget bytecode \
  --cleanCache true \
  --native-log true
```

2026-11-13 的最新源码验收使用 `uitest uiInput click/drag` 对模拟器真实输入，应用 PID
`7465`。权威证据目录为 `/tmp/uni-echarts-x/harmony-final-v2/`，结构化摘要为
`summary.json`，回归日志为 `launch-regression.log`。

已通过：

- 首页和 11 个示例：`basic` 点按扇区显示 tooltip；`async-data` 点击更新后
  Loading/倒计时并刷新；`action-dispatch` 高亮轮播连续变化；`builtin-theme`
  Dark/Light/Loading；`gradient` 双年份径向渐变；`popup` 打开、遮罩关闭、二次打开；
  `pinia-integration` Picker 选择 `Speed` 与增加/减少；`connectable` 拖动 visualMap
  并断开第二图；`manual-update` dataZoom 拖动与 Restore；`custom-tooltip` 显示/隐藏；
  `export-image` 系统图片预览 `1 / 1`。
- 回归页真实点击覆盖折线/柱状/饼图、更新数据、尺寸、容器宽度 autoresize、
  显式 Resize、销毁/重建、卸载/重挂载、Tooltip、Loading、导出、手动更新、
  第二实例、更新全部和原生 scroll-view 拖动。
- 主图首帧 `300x200 / canvas 1050x700 / DPR 3.5`；尺寸切换后
  `240x160 / 840x560`；容器宽度恢复时 `300x160 / 1050x560`；最终恢复到
  `300x200 / 1050x700`。
- 原生 scroll-view 拖动产生 `regression scroll refresh`，主图 `rendered #710-#714`，
  第二图 `second rendered #2-#7`。
- 真实触摸产生 `native: touchstart`、`zr:click`、`native: touchend`，并显示
  Wed/A 150/B 120 tooltip。
- 导出 `dataURL` 长度为 `90106`；Loading 期间连续渲染，关闭后结束；手动模式更新不重绘，
  `applyManual` 后 `rendered #708`。
- 日志中 `[uni-echarts-x] error`、`second error`、FATAL/crash 命中均为 `0`；
  验收结束时进程 `7465` 仍存活。

未验证：

- HarmonyOS release/AppGallery 包。
- 真机。
- 不同 HarmonyOS 版本和不同设备密度。
- 将 11 页每个设置项展开成穷举矩阵；当前以页面主链路和回归页底层能力矩阵为准。

### 5.5 H5 production（VDOM）

产物：

```text
playground-x/unpackage/dist/build/web
```

通过本地静态服务器和 Headless Chrome/CDP 验收。

本轮 production 完整 Demo 已核对 13 条路由：首页、11 个示例和回归页。首页显示
11 个示例入口，不显示“开发验收”；回归页只作为直达路由。除弹窗页按设计初始不挂载
Canvas 外，其余示例页均有非空 Canvas；交互验收的 CDP 异常和控制台错误记录为空。

已通过：

- 13 条路由可直达；11 个示例页真实 Canvas 均非空，回归页两个实例分别为
  `300x200` 和 `240x160`。
- 普通示例 Canvas 为 `390x312` CSS、backing `780x624`；
  `async-data`、`gradient`、`connectable` 为 `390x249.59` CSS、backing `780x499`。
- 浏览器窗口宽度 `1080 -> 600 -> 1080` 时 Canvas 自动 resize，图表同步重排；
  证据为 `h5-prod-resize.png`。
- `popup` 初始无 Canvas；首次打开后生成 `665x665` backing、`332.8x332.8` CSS 的非空
  Canvas。关闭后 Canvas 仍存在且图像哈希不变，遮罩切到 `opacity: 0`、`z-index: -1`，
  同时 popup 进入 `display:none`，布局尺寸变为 `0x0`；二次打开复用同一 Canvas 和同一
  图像哈希。
- `async-data`：点击“更新数据”后出现 Loading 和倒计时，3 秒后恢复。
- `builtin-theme`：Light/Dark 切换与 Loading 开关通过；自定义开关为 `54x32`。
- `pinia-integration`：增加/减少和禁用态通过；拖拽脚本未改变 Picker 选项，改用 CDP
  点击可见的 `Defense` 后成功提交，标签和 Canvas 同步变化。证据为
  `/tmp/uni-echarts-x/h5-arrow-picker-click.json`。
- `connectable`：在当前 production 产物上补测，开启联动时拖动第一图 visualMap，两图
  Canvas 均变化；关闭后拖动第二图，第一图哈希保持不变、第二图变化，确认真实隔离而
  不只是开关样式变化。初始/联动拖动/断开隔离的记录在
  `/tmp/uni-echarts-x/h5-arrow-interactions/report.json`。
- `manual-update`：dataZoom 触摸拖动改变图形；toolbox restore 后 Canvas 哈希恢复到
  初始值。
- `custom-tooltip`：浮层显示 `Search Engine：1048`，右边界约 `368.48 < 390`。
- `export-image`：H5 没有可用的 `uni.previewImage`，改为页内预览；真实 PNG data URL
  长度 `174154`，自然尺寸 `780x624`，加载成功且无捕获错误。
- 折线、柱状、饼图真实绘制。
- 更新、尺寸、显式 Resize、Loading、Tooltip。
- 导出、手动更新、`dispose()`/重建、`v-if` 卸载/挂载。
- 双实例更新和更新全部。
- 原生触摸到 zrender 链路；当前 production 交互审计的 CDP 异常和控制台错误为空。
- 首帧 DPR `1/1`；回归页逻辑与 canvas 均为 `300x200`，窗口缩窄时逻辑尺寸和 canvas
  同步变化。
- 当前 production 产物为 `/tmp/uni-echarts-x/h5-prod-arrow-221300`，已同步到
  `playground-x/unpackage/dist/build/web`；构建日志为
  `/tmp/uni-echarts-x/h5-prod-arrow.log`。上一轮产物
  `/tmp/uni-echarts-x/h5-prod-rebuild-212413` 保留用于对照。
- 当前产物 13 路由截图和尺寸记录在
  `/tmp/uni-echarts-x/h5-arrow-routes-metrics.json`；完整交互记录在
  `/tmp/uni-echarts-x/h5-arrow-interactions.log`，报告为
  `/tmp/uni-echarts-x/h5-arrow-interactions/report.json`。箭头容器测量在
  `/tmp/uni-echarts-x/arrow-report.json`，Picker 实际点击提交证据在
  `/tmp/uni-echarts-x/h5-arrow-picker-click.json`。
- 本轮 13 路由 Canvas 尺寸再次确认：普通页 `390×312` CSS / `780×624` backing，
  `async-data`、`gradient`、`connectable` 为 `390×249.59375` CSS / `780×499`
  backing；弹窗二次打开复用同一 Canvas，图像哈希不变；控制台错误为空。
- 视觉对比中首页、弹窗和 Pinia 箭头的 DOM 容器坐标与尺寸均与旧版一致，H5 截图墨迹
  与旧 Wot Design 图标接近。稳定页剩余整页差异主要来自字体抗锯齿，详见 3.8 节。
- 最后一次核对：13 路由页面无捕获错误；导出页拿到真实 PNG data URL，并在页内预览成功。

未验证：

- H5 Vapor（当前确认为 VDOM）。
- HBuilder CLI 正式发行登录流程。
- Chrome 以外的浏览器和移动浏览器。

### 5.6 微信小程序 x

环境：微信开发者工具 `2.02.2609250`，已登录，项目 AppID 为 `touristappid`；
CDP 端口 `9334`，窗口 ID `2955`。

已通过：

- 首页、11 个示例和 Canvas 兼容回归页，共 13 页可达。
- 13 页在微信开发者工具模拟器窗口中均有真实 Canvas 画面；权威首帧和交互证据在
  `/tmp/uni-echarts-x/wx-goal-final-v4/`，结构化摘要为同目录 `summary.json`。
- 最新一轮共 `83` 步，使用 CDP
  `Emulation.setTouchEmulationEnabled` + `Input.dispatchTouchEvent` 在可见模拟器
  坐标发送触摸，不再用页面 handler 代替点击。
- 11 个示例主链路通过：`basic` 点按扇区显示 tooltip；`async-data` 点击更新后
  Loading/倒计时并刷新；`action-dispatch` 高亮轮播变化；`builtin-theme`
  Light/Loading；`gradient` 首帧；`popup` 打开、遮罩关闭、二次打开；
  `pinia-integration` 增加/减少；`connectable` 联动开关；`manual-update`
  toolbox Restore；`custom-tooltip` 点按显示、空白点按隐藏；`export-image`
  系统图片预览 `1 / 1`。
- 回归页调用原生 `scroll-view.scrollTo()`，日志出现
  `[uni-echarts-x] regression scroll refresh` 并重新渲染；证据为
  `/tmp/uni-echarts-x/wx-final-v4-regression.jsonl` 和
  `wx-final-v4-regression-{top,bottom,top-restored}-window.png`。这是程序化原生滚动，
  不是手指惯性拖拽。
- CDP 运行时审计为 `0` exception、`0` console error；`20` 条 warning 均来自
  `touristappid`、Vue 开发提示、`wx.getSystemInfoSync` 弃用和页面切换时已
  disposal 实例提示。

已知限制：

- 微信自动化 `App.captureScreenshot`/`miniProgram.screenshot()` 不包含 Canvas
  图层，返回白色页面；DevTools 窗口截图能看到图表，因此不能把自动化截图白屏
  误判为组件白屏。
- `touristappid` 下 DevTools 持续弹出“更改 AppID 失败 touristappid /
  Error: tourist appid”，弹窗位于模拟器右侧，不覆盖主要图表区域；它不是组件
  运行时异常。
- CDP 坐标触摸已覆盖主链路，但 Picker 的独立物理手势、visualMap/dataZoom
  手指拖动尚未形成穷举矩阵；回归页滚动重绘是 `scrollTo()` 触发的原生滚动，不是
  手指拖动。
- 未使用真实小程序 AppID，未做上传/体验版验收。

## 6. 能力矩阵

| 能力 | Android Vapor | iOS 17.2 Vapor | HarmonyOS Vapor | H5 VDOM | 微信 x |
| --- | --- | --- | --- | --- | --- |
| 折线/柱状/饼图 | 已验证 | 已验证 | 已验证 | 已验证 | 已验证 |
| `setOption` 自动/手动 | 已验证 | 已验证 | 已验证 | 已验证 | 已验证 |
| 固定尺寸 | 已验证 | 已验证 | 已验证 | 已验证 | 已验证 |
| 显式 `resize()` | 已验证 | 已验证 | 已验证 | 已验证 | 已验证 |
| richText tooltip | 已验证 | 已验证 | 已验证 | 已验证 | 已验证 |
| 原生触摸/点击 | 已验证 | 已验证 | 已验证 | 触摸已验证 | CDP 坐标触摸已验证 |
| loading | 已验证 | 已验证 | 已验证 | 已验证 | 已验证 |
| dispose/reinit | 已验证 | 已验证 | 已验证 | 已验证 | 已验证 |
| `v-if` 卸载/挂载 | 已验证 | 已验证 | 已验证 | 已验证 | 已验证 |
| 双实例隔离 | 已验证 | 已验证 | 已验证 | 已验证 | 已验证 |
| data URL 导出 | 已验证 | 已验证 | 已验证 | 已验证 | 已验证 |
| `toTempFilePath` + 预览 | 已验证 | 已验证 | 已验证系统预览 | 已验证页内预览 | 已验证系统预览 |
| 弹窗内 Canvas（首次打开后常驻） | 已验证 | 已验证开关/二次打开 | 已验证开关/二次打开 | 已验证开关/二次打开 | 已验证开关/二次打开 |
| 应用前后台恢复 | 已验证 | 已验证 | 已验证 | 页面级已验证 | 未验证 |
| 宽度 autoresize | 已验证 | 已验证 | 已验证 | 已验证 | 未专项验收 |
| 内容/高度/横竖屏全自动 resize | 未实现 | 未实现 | 未实现 | 未实现 | 未实现 |
| 桌面鼠标/滚轮 | 不适用 | 不适用 | 不适用 | 未支持 | 不适用 |
| HTML tooltip/formatter | 不支持 | 不支持 | 不支持 | 不支持 | 不支持 |
| SVG renderer | 不支持 | 不支持 | 不支持 | 不支持 | 不支持 |
| dataZoom/restore | 本轮已验证 | 本轮已验证 | 本轮已验证 | production 已验证 | restore 已验证（CDP 触摸） |
| brush/复杂手势 | 未验证 | 未验证 | 未验证 | 未验证 | 未验证 |
| toolbox saveAsImage/dataView | 未验证 | 未验证 | 未验证 | 未验证 | 未验证 |
| heatmap/decal/多 zlevel | 未支持 | 未支持 | 未支持 | 未支持 | 未支持 |
| release 构建 | APK 已构建/验签，运行时未验证 | 未验证 | 未验证 | production 已构建 | 未验证 |

微信主链路由 CDP 坐标触摸驱动；Picker 独立手势、visualMap/dataZoom 手指拖动仍未
完成穷举矩阵。

## 7. 自动化检查

本轮执行结果：

- `pnpm build:uni-x`：通过。
- `pnpm test:x`：`3` 个测试文件、`16` 个测试全部通过。
- `tsconfig.test.json` 类型检查：通过。
- `pnpm verify:uni-x`：产物结构、平台声明、Vapor manifest 和 13 条路由校验通过。

当前工作区已生成 `node_modules/.bin`，直接执行脚本即可。若其他环境缺少本地 bin 链接，
可使用已安装入口作为回退：

```sh
node node_modules/vitest/vitest.mjs run \
  test/core-x-canvas.test.ts \
  test/core-x-touch.test.ts \
  test/core-x-options.test.ts

node node_modules/vue-tsc/bin/vue-tsc.js \
  -p tsconfig.test.json --noEmit
```

测试覆盖：

- DPR 计算、回退和变化阈值。
- host 逻辑/backing 尺寸同步。
- 原生 canvas 导出和独立浏览器 platform canvas。
- 文本测量上下文注册表与多实例销毁。
- 触摸坐标、10px 位移阈值 click 合成、拖拽/长按和 cleanup。
- tooltip 归一化和不修改原对象。

单测不替代端侧验收。

## 8. 风险与阻塞

| 风险/阻塞 | 当前状态 | 处理 |
| --- | --- | --- |
| iOS 17.4 上游 GCanvas 崩溃 | 未解决 | 固定使用 17.2 验收；升级工具链或真机复核后再开放 17.4 |
| iOS 自动化依赖 SimulatorKit HID | 环境限制 | XCUITest 在当前 macOS 27.2.1 + Xcode 16.2 受 AMFI/`DTServiceHub` entitlement 阻塞；本轮已用 SimulatorKit HID 完成真实 tap/drag，后续升级 Xcode/runtime 后重试 XCUITest |
| Android HBuilder 调试资源交接偶发卡住 | 环境问题 | 日志出现 `CapabilityDisabledError: 禁用写入 launch.json 配置` 和旧 `emulator-5554` 发现超时。先查 ADB、`emulator-5556` 和前台进程，再用项目名重新 `cli open`、清理 ADB reverse、force-stop 基座、重启 HBuilderX SDK host 后 launch；不要把交接失败记成模拟器未启动 |
| 微信 `touristappid` 弹窗 | 环境限制 | 真实 AppID 下重跑并清理 DevTools 错误 |
| 微信自动化截图不含 Canvas | 工具限制 | 使用 DevTools 窗口截图；不要把 `miniProgram.screenshot()` 白屏判为组件失败 |
| 微信 Picker/visualMap/dataZoom 手指拖动未穷举 | 验证缺口 | 主链路已使用 CDP 坐标触摸；真实 AppID 下补 Picker 独立手势、visualMap/dataZoom 拖动和 tooltip 触摸命中 |
| HarmonyOS 11 页逐控件矩阵未穷举 | 验证缺口 | 首页、11 示例主链路和回归页底层能力已通过；后续把每个页面的控件/手势展开成独立矩阵 |
| Android release APK 运行时未验证 | 待执行 | APK 已构建/验签；补安装启动、核心交互和真机回归 |
| iOS/HarmonyOS release 未构建 | 待执行 | 分别构建 IPA/HAP 并运行回归 |
| HBuilder CLI 正式发行登录 | 环境阻塞 | 登录后复测发布流程 |
| 高度/横屏全自动 resize | 未实现 | 当前只跟随可观测容器尺寸；后续按产品需求设计 |
| 微信动态宽度 autoresize 未专项验收 | 验证缺口 | 微信已完成 13 页首帧和原生 scroll-view 重绘；真实 AppID 下补容器宽度变化测试 |
| 原生离屏 canvas 能力不足 | 未解决 | heatmap/decal/saveAsImage 暂不支持 |
| 桌面鼠标未接入 H5 | 未实现 | 需要独立 Web 鼠标适配器 |
| 真机与跨浏览器未验证 | 待执行 | 不对外宣称更广兼容 |

## 9. 下一阶段

1. 完成 Android release APK 的安装运行回归；构建 iOS/HarmonyOS release 并运行回归。
2. 固化 iOS SimulatorKit HID 回归脚本，并在升级 Xcode/runtime 后重试 XCUITest。
3. HarmonyOS 补齐 11 页每个控件/手势的逐项交互矩阵。
4. 微信真实 AppID 下补物理 Picker、visualMap/dataZoom 拖动和 tooltip 触摸命中，确认 `touristappid` 弹窗消失；继续使用窗口截图核对 Canvas。
5. 升级 HBuilderX/GCanvas 后复测 iOS 17.4。
6. 决定 H5 桌面鼠标、高度/横屏自动 resize 和离屏 canvas 是否进入 MVP。
7. 将当前手工矩阵沉淀为可重复的端侧回归脚本。

## 10. 验收规则

1. 编译成功只记为“编译通过”。
2. `echarts.init()` 成功只记为“初始化通过”。
3. 必须看到真实像素、更新、触摸和销毁证据，才能把平台标为“核心矩阵通过”。
4. App Vapor、H5 VDOM、微信小程序 x、iOS、HarmonyOS 分开记录。
5. 上游崩溃不得用组件侧成功日志覆盖。
6. 未验证能力必须写“未验证”或“不支持”，不得写成“兼容”。
7. “页面可达”“首帧真实 Canvas”“交互通过”分别记录。
8. 工具截图白屏时必须先确认是否遗漏 Canvas 图层，再判断组件故障。

本轮截图、日志和设备快照保存在本机 `/tmp/uni-echarts-x/`，未纳入仓库。

## 11. 参考资料

- [uni-app x 蒸汽模式](https://doc.dcloud.net.cn/uni-app-x/app-vapor.html)
- [uni-app x canvas 组件](https://doc.dcloud.net.cn/uni-app-x/component/canvas.html)
- [uni.createCanvasContextAsync](https://doc.dcloud.net.cn/uni-app-x/api/create-canvas-context-async.html)
- [CanvasRenderingContext2D](https://doc.dcloud.net.cn/uni-app-x/api/canvasrenderingcontext2d.html)
- [UniCanvasElement](https://doc.dcloud.net.cn/uni-app-x/api/dom/unicanvaselement.html)
