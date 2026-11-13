# uni-echarts-x

Apache ECharts adapter for uni-app x. It provides a Canvas 2D chart component for App Vapor,
H5 VDOM, and mini program x without rewriting ECharts in UTS or injecting a fake DOM. Height
stays explicit; width can follow the parent through `autoresize`.

The package is still under compatibility verification. A successful compile or `echarts.init()`
call is not, by itself, a platform support claim.

## Current status

The old playground home page and all 11 examples have been ported to `playground-x`.
Core-runtime evidence and complete-demo evidence are tracked separately.

| Target | Core runtime | Complete playground | Evidence boundary |
| --- | --- | --- | --- |
| Android App Vapor, debug bytecode | Verified | Verified | 11 example pages plus container autoresize, theme/loading, popup, Pinia, connectable, dataZoom/restore, custom tooltip, and export preview were operated on a visible AVD; a final recheck also verified action-dispatch rotation, gradient, Pinia picker/increment, custom tooltip show/hide, and export preview |
| iOS 17.2 App Vapor, debug bytecode | Verified | Verified | All 11 examples were operated through SimulatorKit HID, including tooltip, loading, themes, popup close/reopen, Pinia picker/increment, connectable drag/isolation, dataZoom/restore, custom tooltip, and export preview. The regression page also covered autoresize, native scroll refresh, lifecycle, and second-instance updates |
| HarmonyOS API 20 App Vapor, debug bytecode | Verified | Verified | All 11 examples and the regression page passed with real `uitest uiInput` clicks/drags; the final pass covered autoresize, native scroll refresh, tooltip, Loading, export data URL, manual update, dispose/reinit, unmount/remount, native touch, and second/all-instance updates |
| H5 production VDOM | Verified | Verified | 13 routes; all 11 examples and the regression page passed real-canvas checks. Async loading, theme/loading, Pinia increment and Picker commit, persistent-canvas popup close/reopen, visualMap connection and isolation, dataZoom/restore, custom tooltip, in-page export preview, and window autoresize were operated. This is VDOM, not Vapor |
| WeChat mini program x | Verified | Verified | DevTools `2.02.2609250`; all 11 example primary paths and the regression page were exercised with CDP coordinate touches. Async loading, theme/loading, popup close/reopen, Pinia increment/decrement, connectable switch, tooltip show/hide, and export system preview passed with 0 exceptions and 0 console errors |
| iOS 17.4 App Vapor | Blocked upstream | Not applicable | Historical launch crashes in GCanvas rendering, not in component code |
| Release packages | Android APK built before latest changes | Not verified | Android release APK was built and signature-verified but must be rebuilt; install/run, IPA/HAP, real-device, and store publication remain unverified |

Verified toolchain: HBuilderX `5.33.2026102115-alpha`, Android 14 AVD, iOS 17.2 simulator,
HarmonyOS API 20 simulator, WeChat DevTools `2.02.2609250`, Xcode 16.2, and ECharts `6.1.0`.

H5 is **VDOM**, not Vapor. WeChat DevTools currently uses `touristappid`; a real AppID and
production upload are still required for clean release acceptance. WeChat automation
`miniProgram.screenshot()` does not include the canvas layer, so DevTools window screenshots were
used for visual verification. The final WeChat interaction pass used
`Emulation.setTouchEmulationEnabled` plus `Input.dispatchTouchEvent` at visible simulator
coordinates; it did not call page handlers to substitute for taps. The independent physical Picker
gesture and visualMap/dataZoom finger-drag matrix still needs a real AppID pass.

`autoresize` is currently verified for parent-width changes on Android, iOS, HarmonyOS, and H5.
WeChat dynamic width resize remains unverified.

XCUITest is blocked on the current macOS 27.2.1 + Xcode 16.2 host by an
AMFI/`DTServiceHub` entitlement failure. iOS acceptance therefore uses a SimulatorKit HID helper
that sends tap and drag events directly to the booted simulator. The helper source is
`/tmp/uni-echarts-x/ios-ui-tests/simhid.swift`; its executable is
`/tmp/uni-echarts-x/ios-ui-tests/bin/simhid`.

## Requirements

- `echarts >= 6.1.0`
- `vue >= 3.3.0`
- HBuilderX/HBuilderV with uni-app x Vapor support
- Explicit numeric `height`
- Numeric `width` when `autoresize` is disabled
- ECharts modules registered by the host page with `echarts.use([...])`

## Usage

```vue
<template>
  <uni-echarts-x
    ref="chartRef"
    :width="300"
    :height="200"
    autoresize
    :option="option"
    :loading="loading"
    @inited="onInited"
    @zr:click="onZrClick"
  />
</template>

<script setup lang="ts">
import * as echarts from "echarts/core"
import { BarChart, LineChart, PieChart } from "echarts/charts"
import { GridComponent, LegendComponent, TooltipComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"

echarts.use([
  BarChart,
  LineChart,
  PieChart,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  CanvasRenderer,
])

const chartRef = ref()
const option = ref({
  animation: false,
  tooltip: {
    trigger: "axis",
  },
  xAxis: {
    type: "category",
    data: ["A", "B", "C"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      type: "line",
      data: [12, 20, 15],
    },
  ],
})
</script>
```

For `uni_modules`, build and import `xiaohe-echarts-x`:

```sh
pnpm build:uni-x
```

## Component API

Props:

- `width`: fallback logical width in pixels when `autoresize` is disabled.
- `height`: explicit logical height in pixels.
- `autoresize`: make the root width `100%` of its parent and observe native Canvas size changes.
- `option`, `theme`, `initOptions`, `updateOptions`.
- `manualUpdate`: defer option changes until `setOption()` is called.
- `loading`, `loadingOptions`.
- `visible`: gates initialization and refresh.
- `group`, `disableScroll`, `customClass`, `customStyle`, `initDelay`.

Exposed methods:

- `setOption(option, updateOptions?)`
- `resize({ width?, height? }?)`
- `dispose()`, `clear()`
- `getWidth()`, `getHeight()`, `getOption()`, `getMetrics()`
- `getDom()`, `dispatchAction(payload)`, `getDataURL(options?)`
- `toTempFilePath(options?)`
- `chart`, `canvasId`

`getDom()` returns the ECharts canvas host adapter, not a native `UniCanvasElement`.

`getMetrics()` returns:

```ts
{
  width: number
  height: number
  canvasWidth: number
  canvasHeight: number
  dpr: number
  renderDpr: number
}
```

`toTempFilePath()` returns `Promise<{ tempFilePath: string }>`. On H5 the path is a data URL.
On native App platforms it writes the PNG to `uni.env.USER_DATA_PATH` and resolves the local file
path. Use a user action before exporting. The uni-app x H5 runtime currently has no usable
`uni.previewImage`, so callers should either render an in-page preview under `#ifdef H5` or keep
`uni.previewImage` behind `#ifndef H5` for native App targets.

## Runtime behavior

- The ECharts host intentionally has no `nodeName`, so zrender uses the single-canvas path.
- Logical size and native backing size are tracked separately. Native backing dimensions are
  synchronized from the platform DPR.
- The host context is retained and `draw()` is called after zrender renders.
- Tooltip `renderMode` is forced to `richText` for both top-level and series-level tooltips.
- Native touch events are normalized into zrender mouse events. A click is synthesized when
  the release point is within 10px of the press point on both axes; press duration is not
  limited.
- Page and app visibility hooks suspend initialization while hidden and refresh the canvas after
  returning to the foreground.
- An explicit `dispose()` invalidates an in-flight Canvas context request, so a late platform
  callback cannot recreate the chart.
- Theme/init-option recreation requested while hidden is deferred until the page and app are
  visible again. An option changed while hidden is applied from the latest props on resume.
- Leaving `manualUpdate` mode clears the saved manual option and resumes props-driven updates.
- Foreground refresh re-measures layout and recreates the chart when render DPR changed.
- With `autoresize`, the root width is `100%` and `UniResizeObserver` watches the native Canvas.
  Size changes are debounced by 50ms and followed by `resize()`. If the platform does not expose
  `UniResizeObserver`, the component silently falls back to explicit `resize()` and fixed sizing.
- Text measurement keeps a registry of live chart contexts. Disposing one instance does not leave
  zrender pointing at a dead context.
- `getDataURL()` reads the active chart canvas directly. It does not call ECharts
  `renderToCanvas()`, because zrender's global `platformApi.createCanvas` could otherwise overwrite
  another chart instance.
- `toTempFilePath()` uses the same direct-canvas export path, then writes native output to
  `uni.env.USER_DATA_PATH`. H5 returns the data URL without writing a file. The H5 runtime does not
  provide a usable `uni.previewImage`; the playground uses an in-page preview for H5 instead.
- For popup or modal examples, mount the chart after the opening transition. The current
  playground mounts it after about 220ms. On Android Vapor, removing and reinserting the native
  Canvas can leave `@ready` silent and exhaust asynchronous context retries, so the popup keeps
  the Canvas mounted after the first open and closes by hiding the mask and setting the popup host
  to `display:none`. The page still disposes it on unload. `autoresize` can follow later
  parent-width changes, but it does not schedule mount or unmount.

## Limitations

- Automatic resizing covers observed container-size changes when `UniResizeObserver` is available.
  There is no automatic height-from-content policy or independent orientation listener. Without
  the observer, use explicit `resize()`.
- Popup charts intentionally keep one chart instance mounted after first open as an Android Vapor
  compatibility tradeoff. Closing hides the mask and sets the popup host to `display:none` instead
  of releasing the Canvas; navigate away from the page when the instance should be disposed.
- Touch mapping is implemented. Desktop mouse hover, mousedown, and wheel events are not bound in
  the H5 VDOM build.
- HTML tooltip, DOM formatter, and SVG renderer are not supported.
- App export currently applies `type` and `quality` through
  `UniCanvasElement.toDataURL()` before writing the file. H5 also supports background and
  pixel-ratio composition and returns a data URL from `toTempFilePath()`. H5 preview must be
  implemented in-page or behind platform conditional compilation because `uni.previewImage` is
  unavailable there.
- Call `getDataURL()`/`toTempFilePath()` from a user action or after `rendered`. Some App platforms reject canvas
  export during early lifecycle callbacks.
- Heatmap/decal and some multi-zlevel custom layers need a second offscreen canvas and are not
  supported until a native offscreen adapter exists. The platform `createCanvas` hook throws a
  descriptive error instead of reusing a chart host.
- `dataZoom` and toolbox `restore` are verified in the Android, iOS, HarmonyOS, and H5 complete
  demos. WeChat restore was tapped through CDP; a dedicated finger-drag matrix remains unverified.
- ECharts toolbox `saveAsImage`/`dataView`, `brush`, and complex gestures still need separate
  verification. Prefer `toTempFilePath()` for a portable save-image flow.
- iOS 17.4 remains blocked by the upstream GCanvas simulator crash. iOS 17.2 is the current
  verified simulator baseline.
- The Android release APK is built and signature-verified, but predates the current
  workspace/CI changes and must be rebuilt before final submission. It has not been installed or
  run. IPA/HAP, real-device runs, real WeChat AppID, and cross-browser checks are still unverified.

## Tests

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

These commands pass in the current workspace. If local `node_modules/.bin` links are unavailable
in another environment, invoke the installed entry points:

```sh
node node_modules/vitest/vitest.mjs run \
  test/core-x-canvas.test.ts \
  test/core-x-touch.test.ts \
  test/core-x-options.test.ts

node node_modules/vue-tsc/bin/vue-tsc.js -p tsconfig.test.json --noEmit
```

Unit tests cover DPR resolution, canvas host sizing, export, browser platform canvases,
multi-instance text-measurement cleanup, touch normalization/click synthesis, and option/tooltip
normalization. They do not replace device-level acceptance.
