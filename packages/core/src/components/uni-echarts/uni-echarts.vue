<template>
  <view
    ref="root"
    class="uni-echarts"
    :class="props.customClass"
    :style="props.customStyle"
    @click="emit('native:click', $event)"
    @dblclick="emit('native:dblclick', $event)"
    @mouseout="emit('native:mouseout', $event)"
    @mouseover="emit('native:mouseover', $event)"
    @mouseup="emit('native:mouseup', $event)"
    @mousedown="emit('native:mousedown', $event)"
    @mousemove="emit('native:mousemove', $event)"
    @contextmenu="emit('native:contextmenu', $event)"
    @mousewheel="emit('native:mousewheel', $event)"
    @drag="emit('native:drag', $event)"
    @dragstart="emit('native:dragstart', $event)"
    @dragend="emit('native:dragend', $event)"
    @dragenter="emit('native:dragenter', $event)"
    @dragleave="emit('native:dragleave', $event)"
    @dragover="emit('native:dragover', $event)"
    @drop="emit('native:drop', $event)"
    @touchstart="emit('native:touchstart', $event)"
    @touchmove="emit('native:touchmove', $event)"
    @touchcancel="emit('native:touchcancel', $event)"
    @touchend="emit('native:touchend', $event)"
    @tap="emit('native:tap', $event)"
    @longpress="emit('native:longpress', $event)"
    @longtap="emit('native:longtap', $event)"
    @transitionend="emit('native:transitionend', $event)"
    @animationstart="emit('native:animationstart', $event)"
    @animationiteration="emit('native:animationiteration', $event)"
    @animationend="emit('native:animationend', $event)"
    @touchforcechange="emit('native:touchforcechange', $event)">
    <canvas
      v-if="useCanvas2D"
      :id="canvasId"
      class="uni-echarts__canvas"
      type="2d"
      :disable-scroll="props.disableScroll"
      @touchstart="touch.onStart"
      @touchmove="touch.onMove"
      @touchend="touch.onEnd"></canvas>

    <canvas
      v-else
      :id="canvasId"
      class="uni-echarts__canvas"
      :canvas-id="canvasId"
      :disable-scroll="props.disableScroll"
      @touchstart="touch.onStart"
      @touchmove="touch.onMove"
      @touchend="touch.onEnd"></canvas>

    <view
      v-if="isPc"
      class="uni-echarts__mask"
      @mousedown="touch.onStart"
      @mousemove="touch.onMove"
      @mouseup="touch.onEnd"
      @touchstart="touch.onStart"
      @touchmove="touch.onMove"
      @touchend="touch.onEnd"></view>

    <slot></slot>
  </view>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, shallowRef, watch, watchEffect } from "vue";
import {
  useAutoresize,
  useEcharts,
  useEchartsInitOptions,
  useEchartsMouseWheel,
  useEchartsOption,
  useEchartsTheme,
  useEchartsTouch,
  useEchartsUpdateOptions,
  useLoading,
  usePublicApi,
  useUid,
  useVueThis
} from "../../composables";
import { setupEchartsCanvas, UniCanvas } from "../../utils/canvas";
import { getIsPc } from "../../utils/device";
import { defaultTo, isEmpty, sleep } from "../../utils/helpers";
import { canIUseCanvas2d, getWindowInfo, querySelect } from "../../utils/uni";
import { ECHARTS_EVENTS, EVENTS } from "./events";

defineOptions({
  name: "UniEcharts",
  options: {
    virtualHost: true
  }
});

const props = defineProps({
  customClass: [String, Object, Array],
  customStyle: [String, Object],
  option: Object,
  optionKey: String,
  theme: [Object, String],
  initOptions: Object,
  updateOptions: Object,
  group: String,
  manualUpdate: Boolean,
  autoresize: [Boolean, Object],
  loading: Boolean,
  loadingOptions: Object,
  canvasType: {
    type: String,
    default: "2d"
  },
  disableScroll: Boolean,
  supportHover: Boolean,
  initDelay: {
    type: Number,
    default: 30
  }
});

const emit = defineEmits(EVENTS);

const vueThis = useVueThis();

const echarts = useEcharts();

const isPc = getIsPc();

const root = shallowRef(null);

const canvasId = `uni-chart${useUid()}`;

const chart = shallowRef(null);

const manualOption = shallowRef(null);

const {
  innerOption,
  injectOption
} = useEchartsOption(props.optionKey, () => defaultTo(manualOption.value, props.option));
const { innerTheme } = useEchartsTheme(() => props.theme);
const { innerInitOptions } = useEchartsInitOptions(() => props.initOptions);
const { innerUpdateOptions } = useEchartsUpdateOptions(() => props.updateOptions);

const useCanvas2D = computed(() => {
  if (!canIUseCanvas2d()) {
    return false;
  }

  return props.canvasType === "2d";
});

const canvasRect = reactive({
  top: 0,
  left: 0,
  width: 0,
  height: 0
});

function getRelativeTouch(event, touches) {
  let { clientX, clientY } = event;

  if (!(clientX && clientY) && touches && touches[0]) {
    clientX = touches[0].clientX;
    clientY = touches[0].clientY;
  }

  return {
    x: clientX - canvasRect.left,
    y: clientY - canvasRect.top,
    wheelDelta: defaultTo(event.wheelDelta, 0)
  };
}

function getTouch(event, touches) {
  const { x } = defaultTo(touches && touches[0], {});

  return x ? touches[0] : getRelativeTouch(event, touches);
}

const touch = useEchartsTouch({
  vueThis,
  supportHover: () => props.supportHover,
  isPc,
  canvasId,
  chart,
  canvasRect,
  getTouch
});

// #ifdef WEB

useEchartsMouseWheel({
  isPc,
  chart,
  getTouch
});

// #endif

async function getContext() {
  const { top, left, width, height, node } = await querySelect(vueThis, `#${canvasId}`, {
    rect: true,
    size: true,
    node: useCanvas2D.value
  });

  const devicePixelRatio = getWindowInfo().pixelRatio;

  let dpr = devicePixelRatio;

  let canvas;

  if (node != null) {
    canvas = new UniCanvas(canvasId, node.getContext("2d"), node);
  } else {
    // #ifdef WEB
    dpr = 1;
    // #endif
    // #ifdef MP-ALIPAY || MP-LARK
    dpr = devicePixelRatio;
    // #endif
    // #ifdef MP-TOUTIAO
    dpr = isPc ? 1 : devicePixelRatio;
    // #endif
    // #ifndef WEB || MP-ALIPAY || MP-LARK || MP-TOUTIAO
    dpr = isPc ? devicePixelRatio : 1;
    // #endif

    canvas = new UniCanvas(canvasId, uni.createCanvasContext(canvasId, vueThis), null);
  }

  return {
    top,
    left,
    width,
    height,
    node,
    canvas,
    dpr
  };
}

async function init(option) {
  if (props.initDelay > 0) {
    await sleep(props.initDelay);
  }

  const context = await getContext();

  canvasRect.top = context.top;
  canvasRect.left = context.left;
  canvasRect.width = context.width;
  canvasRect.height = context.height;

  setupEchartsCanvas(echarts, {
    canvas: context.canvas,
    node: context.node
  });

  const instance = chart.value = echarts.init(context.canvas, innerTheme.value, {
    devicePixelRatio: context.dpr,
    renderer: "canvas",
    width: context.width,
    height: context.height,
    ...innerInitOptions.value
  });

  if (props.group) {
    instance.group = props.group;
  }

  const zr = instance.getZr();

  for (const evt of ECHARTS_EVENTS) {
    if (evt.indexOf("zr:") === 0) {
      zr.on(evt.substring(3), (...args) => {
        emit(evt, ...args);
      });
    } else {
      instance.on(evt, (...args) => {
        emit(evt, ...args);
      });
    }
  }

  // #ifdef WEB
  const _resize = () => {
    if (instance == null || instance.isDisposed()) {
      return;
    }

    const { offsetWidth, offsetHeight } = root.value.$el;

    instance.resize({
      width: offsetWidth,
      height: offsetHeight
    });
  };
  // #endif

  const _commit = () => {
    emit("inited");

    const opt = defaultTo(option, innerOption.value);

    if (isEmpty(opt)) {
      return;
    }

    instance.setOption(opt, innerUpdateOptions.value);
  };

  // #ifdef WEB
  if (props.autoresize) {
    await nextTick();

    _resize();
    _commit();
  } else {
    _commit();
  }
  // #endif

  // #ifndef WEB
  _commit();
  // #endif
}

function setOption(option, updateOptions) {
  if (props.manualUpdate) {
    manualOption.value = option;
  }

  if (chart.value == null) {
    init(option);
  } else {
    chart.value.setOption(option, defaultTo(updateOptions, {}));
  }
}

async function resize(options = {}) {
  if (chart.value == null) {
    return;
  }

  let { width, height } = options;

  const updateWidth = isEmpty(width) || width === "auto";
  const updateHeight = isEmpty(height) || height === "auto";

  if (updateWidth || updateHeight) {
    const el = await querySelect(vueThis, `#${canvasId}`, {
      size: true
    });

    if (updateWidth) {
      width = el.width;
    }
    if (updateHeight) {
      height = el.height;
    }
  }

  chart.value.resize({
    ...options,
    width,
    height
  });
}

function cleanup() {
  if (chart.value == null) {
    return;
  }

  chart.value.dispose();
  chart.value = null;
}

let unwatchOption;

watch(() => props.manualUpdate, (manual) => {
  if (typeof unwatchOption === "function") {
    unwatchOption();
    unwatchOption = null;
  }

  if (manual) {
    return;
  }

  unwatchOption = watch(() => defaultTo(props.option, injectOption.value), (value, oldValue) => {
    if (isEmpty(value)) {
      return;
    }

    if (chart.value == null) {
      init();
    } else {
      chart.value.setOption(value, {
        notMerge: value !== oldValue,
        ...innerUpdateOptions.value
      });
    }
  }, {
    deep: true
  });
}, {
  immediate: true
});

watch([innerTheme, innerInitOptions], () => {
  cleanup();
  init();
}, {
  deep: true
});

watchEffect(() => {
  if (props.group && chart.value != null) {
    chart.value.group = props.group;
  }
});

const publicApi = usePublicApi(chart);

useLoading(chart, {
  loading: () => props.loading,
  loadingOptions: () => props.loadingOptions
});

// #ifdef WEB

useAutoresize(chart, {
  echarts,
  autoresize: () => props.autoresize,
  root
});

// #endif

function toTempFilePath(options) {
  if (chart.value == null || chart.value.isDisposed()) {
    return;
  }

  const canvas = chart.value.getDom();

  if (canvas == null) {
    return;
  }

  return canvas.toTempFilePath(options);
}

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  cleanup();
});

defineExpose({
  root,
  canvasId,
  chart,
  setOption,
  resize,
  ...publicApi,
  toTempFilePath
});
</script>

<style scoped>
.uni-echarts {
  position: relative;
}

.uni-echarts__canvas {
  width: 100%;
  height: 100%;
}

.uni-echarts__mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
}
</style>