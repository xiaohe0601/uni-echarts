<template>
  <section class="VPCodegen">
    <section class="options">
      <label>
        渲染器
        <select v-model="renderer">
          <option value="canvas">Canvas</option>
          <option value="svg">SVG</option>
        </select>
      </label>

      <label>
        TypeScript
        <input v-model="codegenOptions.includeType" type="checkbox" />
      </label>

      <label>
        多行
        <input v-model="codegenOptions.multiline" type="checkbox" />
      </label>

      <label>
        分号
        <input v-model="codegenOptions.semi" type="checkbox" />
      </label>

      <label>
        引号
        <select v-model="codegenOptions.quote">
          <option value="'">单引号</option>
          <option value="&quot;">双引号</option>
        </select>
      </label>

      <label>
        缩进
        <select v-model="codegenOptions.indent">
          <option value="  ">2 个空格</option>
          <option value="    ">4 个空格</option>
          <!-- eslint-disable-next-line style/no-tabs -->
          <option value="	">制表符</option>
        </select>
      </label>

      <label>
        行最大长度
        <input
          v-model.number="codegenOptions.maxLen"
          type="number"
          step="10" />
      </label>
    </section>

    <section class="code">
      <div
        ref="editorEl"
        class="option-code"
        aria-label="ECharts option (TS/JS literal)"
        :aria-busy="isBusy"></div>

      <div
        ref="outputEl"
        class="import-code"
        role="textbox"
        aria-label="Generated import code"
        aria-readonly="true"></div>
    </section>

    <section class="footer">
      <span class="copyright">Design by <a href="https://vue-echarts.dev" target="_blank">Vue ECharts</a></span>
    </section>
  </section>
</template>

<script setup lang="ts">
import { useLocalStorage, useTimeoutFn } from "@vueuse/core";
import { useData } from "vitepress";
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { AnalyzerIssue } from "../composables/useOptionAnalysis";
import { useOptionAnalysis } from "../composables/useOptionAnalysis";
import type { CodeViewer, OptionEditor } from "../services/monaco";
import { createCodeViewer, createOptionEditor } from "../services/monaco";
import type { PublicCodegenOptions, Quote } from "../utils/codegen";
import { getImportsFromOption } from "../utils/codegen";

type Renderer = "canvas" | "svg";

interface CodegenPreferences {
  indent: string;
  quote: Quote;
  multiline: boolean;
  maxLen: number;
  semi: boolean;
  includeType: boolean;
  renderer: Renderer;
}

const props = defineProps<{
  renderer: Renderer;
}>();

const DEFAULT_OPTION = `{
  title: {
    text: "Referer of a Website",
    subtext: "Fake Data",
    left: "center"
  },
  tooltip: {
    trigger: "item"
  },
  legend: {
    orient: "vertical",
    left: "left"
  },
  series: [
    {
      name: "Access From",
      type: "pie",
      radius: "50%",
      data: [
        { value: 1048, name: "Search Engine" },
        { value: 735, name: "Direct" },
        { value: 580, name: "Email" },
        { value: 484, name: "Union Ads" },
        { value: 300, name: "Video Ads" }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)"
        }
      }
    }
  ]
}`;

const editorEl = ref<HTMLElement | null>(null);
const outputEl = ref<HTMLElement | null>(null);

let optionEditor: OptionEditor | null = null;
let importViewer: CodeViewer | null = null;

let suppressNextEditorEvent = false;

const codegenOptions = useLocalStorage<CodegenPreferences>(
  "ue.codegenOptions",
  {
    indent: "  ",
    quote: `"`,
    multiline: false,
    maxLen: 80,
    semi: true,
    includeType: false,
    renderer: "canvas"
  }
);

const {
  code: sourceCode,
  state: analysisState,
  updateSource,
  dispose: disposeAnalysis
} = useOptionAnalysis(DEFAULT_OPTION);

const initializing = ref(true);
const showAnalyzingOverlay = ref(false);

const { start: scheduleAnalyzingOverlay, stop: cancelAnalyzingOverlay } =
  useTimeoutFn(() => {
    showAnalyzingOverlay.value = true;
  }, 180);

const renderer = ref<Renderer>(props.renderer === "svg" ? "svg" : "canvas");

codegenOptions.value.renderer = renderer.value;

watch(
  () => props.renderer,
  (value) => {
    renderer.value = value === "svg" ? "svg" : "canvas";
  }
);

watch(renderer, (value) => {
  codegenOptions.value.renderer = value;
});

const { isDark } = useData();

const monacoTheme = computed(() => isDark.value ? "vs-dark" : "vs");

function formatIssues(issues: readonly AnalyzerIssue[]) {
  if (!issues.length) {
    return "";
  }

  return issues
    .map((issue) => {
      const lines = [`/* ${issue.message} */`];

      if (issue.hint) {
        lines.push(`// Hint: ${issue.hint}`);
      }
      if (issue.range) {
        lines.push(`// ${issue.range.startLineNumber}:${issue.range.startColumn}`);
      }

      return lines.join("\n");
    })
    .join("\n\n");
}

const hasErrors = computed(() => analysisState.hasBlockingIssue);

const isBusy = computed(() => initializing.value || showAnalyzingOverlay.value);

const importCode = computed(() => {
  const raw = sourceCode.value.trim();

  if (!raw) {
    return "// Paste your option code first";
  }

  if (hasErrors.value) {
    const blockingIssues = analysisState.issues.filter(
      (issue) => issue.severity === "error"
    );

    return formatIssues(blockingIssues);
  }

  if (!analysisState.option) {
    return "// Option analysis did not produce a result";
  }

  try {
    const preferences = codegenOptions.value;
    const config: PublicCodegenOptions = {
      indent: preferences.indent,
      quote: preferences.quote,
      multiline: preferences.multiline,
      maxLen: preferences.maxLen,
      semi: preferences.semi,
      includeType: preferences.includeType,
      renderer: renderer.value
    };
    return getImportsFromOption(analysisState.option, config);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : String(error ?? "Unknown error");
    return `/* Invalid ECharts option */\n\n// ${message}`;
  }
});

watch(importCode, (value) => {
  importViewer?.setValue(value.trim());
});

watch(monacoTheme, (theme) => {
  optionEditor?.setTheme(theme);
  importViewer?.setTheme(theme);
});

watch(
  () => codegenOptions.value.includeType,
  (includeType) => {
    importViewer?.setLanguage(includeType ? "typescript" : "javascript");
    importViewer?.setValue(importCode.value);
  }
);

watch(
  () => analysisState.status,
  (status) => {
    if (status === "analyzing" && !initializing.value) {
      scheduleAnalyzingOverlay();
      return;
    }

    cancelAnalyzingOverlay();
    showAnalyzingOverlay.value = false;
  },
  { immediate: true }
);

watch(
  () => analysisState.diagnostics,
  (diagnostics) => {
    optionEditor?.setMarkers(diagnostics);
  },
  { deep: true }
);

watch(sourceCode, (value) => {
  if (!optionEditor) {
    return;
  }

  const current = optionEditor.getValue();

  if (current === value) {
    return;
  }

  try {
    suppressNextEditorEvent = true;
    optionEditor.setValue(value);
  } finally {
    suppressNextEditorEvent = false;
  }
});

async function bootstrap() {
  renderer.value = props.renderer === "svg" ? "svg" : "canvas";

  await nextTick();

  optionEditor?.editor.focus();
  optionEditor?.editor.layout();
  importViewer?.editor.layout();
}

onMounted(async () => {
  await nextTick();

  if (editorEl.value) {
    optionEditor = createOptionEditor(editorEl.value, {
      initialCode: sourceCode.value,
      theme: monacoTheme.value,
      onChange(value) {
        if (suppressNextEditorEvent) {
          return;
        }
        updateSource(value);
      }
    });
    optionEditor.setMarkers(analysisState.diagnostics);
  }

  if (outputEl.value) {
    importViewer = createCodeViewer(outputEl.value, {
      initialCode: importCode.value,
      language: codegenOptions.value.includeType ? "typescript" : "javascript",
      theme: monacoTheme.value
    });
  }
  initializing.value = false;

  bootstrap();
});

onBeforeUnmount(() => {
  cancelAnalyzingOverlay();

  optionEditor?.dispose();
  optionEditor = null;

  importViewer?.dispose();
  importViewer = null;

  disposeAnalysis();
});
</script>

<style scoped>
.VPCodegen {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-size: 14px;
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
}

.options {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.options label {
  display: flex;
  gap: 8px;
  align-items: center;
  user-select: none;
}

.options input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: var(--vp-c-brand-1);
  cursor: pointer;
}

.options input[type="number"],
.options select {
  padding: 2px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
}

.options input[type="number"] {
  width: 60px;
}

.options select {
  cursor: pointer;
}

.code {
  display: flex;
}

.code :deep(.monaco-editor) {
  --vscode-editor-background: transparent;
  --vscode-editorGutter-background: transparent;
}

.option-code,
.import-code {
  width: 50%;
  height: 520px;
  overflow: hidden;
}

.option-code {
  border-right: 1px solid var(--vp-c-divider);
}

.option-code[aria-busy="true"]::after {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  content: "正在分析...";
  background-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
}

.footer {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  font-size: 12px;
  border-top: 1px solid var(--vp-c-divider);
}

.copyright {
  margin-left: auto;
}

html.dark .option-code[aria-busy="true"]::after {
  background-color: rgba(0, 0, 0, 0.6);
}

@media (max-width: 1200px) {
  .code {
    flex-direction: column;
  }

  .option-code,
  .import-code {
    width: 100%;
  }

  .option-code {
    border-right-width: 0;
    border-bottom: 1px solid var(--vp-c-divider);
  }
}
</style>