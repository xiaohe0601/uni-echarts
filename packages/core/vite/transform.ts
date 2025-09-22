import type {
  Directive,
  ExportDefaultDeclaration,
  ObjectExpression,
  ObjectPropertyKind,
  Statement
} from "@oxc-project/types";
import type { ParseResult, StaticImport } from "oxc-parser";
import { parseAsync } from "oxc-parser";
import type { SFCDescriptor } from "vue/compiler-sfc";
import { MagicString } from "vue/compiler-sfc";
import { parseVueSFC } from "./helpers";

interface Asts {
  scriptSetup: ParseResult | null;
  script: ParseResult | null;
}

export interface TransformOptions {
  provideECharts?: boolean | string;
}

export async function transform(code: string, options: Required<TransformOptions>) {
  if (!options.provideECharts) {
    return null;
  }

  const sfc = await parseVueSFC(code);

  const asts: Asts = {
    scriptSetup: null,
    script: null
  };

  if (sfc.scriptSetup != null) {
    asts.scriptSetup = await parseAsync(`script.${sfc.scriptSetup.lang || "js"}`, sfc.scriptSetup.content);
  }
  if (sfc.script != null) {
    asts.script = await parseAsync(`script.${sfc.script.lang || "js"}`, sfc.script.content);
  }

  const ms = new MagicString(code);

  if (options.provideECharts) {
    await injectEChartsProvide({
      sfc,
      ms,
      asts,
      echarts: options.provideECharts === true ? "echarts/core" : options.provideECharts
    });
  }

  return ms;
}

async function injectEChartsProvide(options: {
  sfc: SFCDescriptor;
  ms: MagicString;
  asts: Asts;
  echarts: string;
}) {
  const { sfc, ms } = options;

  if (sfc.template == null || !/<(?:UniEcharts|uni-echarts)/.test(sfc.template.content)) {
    return;
  }

  if (sfc.scriptSetup != null) {
    const ast = options.asts.scriptSetup!;

    const { staticImports } = ast.module;

    const {
      hasImportEcharts,
      hasImportProvide
    } = findEChartsProvideImports(staticImports, {
      echarts: options.echarts,
      provide: "provideEcharts"
    });

    const hasCallProvide = ast.program.body.some((item) => {
      return item.type === "ExpressionStatement"
        && item.expression.type === "CallExpression"
        && item.expression.callee.type === "Identifier"
        && item.expression.callee.name === "provideEcharts";
    });

    const imports: string[] = [];

    if (!hasImportEcharts) {
      imports.push(`import * as echarts from "${options.echarts}";`);
    }
    if (!hasImportProvide) {
      imports.push(`import { provideEcharts } from "uni-echarts/shared";`);
    }

    const appendImportsIndex = staticImports.length > 0
      ? staticImports[staticImports.length - 1].end
      : sfc.scriptSetup.loc.start.offset;

    if (imports.length > 0) {
      ms.appendLeft(appendImportsIndex, `\n${imports.join("\n")}`);
    }

    if (!hasCallProvide) {
      ms.appendLeft(appendImportsIndex, `\nprovideEcharts(echarts);`);
    }
  } else if (sfc.script != null) {
    const ast = options.asts.script!;

    const { staticImports } = ast.module;

    const {
      hasImportEcharts,
      hasImportProvide
    } = findEChartsProvideImports(staticImports, {
      echarts: options.echarts,
      provide: "ECHARTS_KEY"
    });

    const {
      optionsExp,
      provideExp,
      provideAccept,
      hasProvideEcharts
    } = findOptionsProvide(ast.program.body);

    const imports: string[] = [];

    if (!hasImportEcharts) {
      imports.push(`import * as echarts from "${options.echarts}";`);
    }
    if (!hasImportProvide) {
      imports.push(`import { ECHARTS_KEY } from "uni-echarts/shared";`);
    }

    const appendImportsIndex = staticImports.length > 0
      ? staticImports[staticImports.length - 1].end
      : sfc.script.loc.start.offset;

    if (imports.length > 0) {
      ms.appendLeft(appendImportsIndex, `\n${imports.join("\n")}`);
    }

    if (!hasProvideEcharts) {
      if (provideExp != null) {
        ms.appendLeft(
          provideExp.start + 1,
          `\n    [ECHARTS_KEY]: echarts${provideExp.properties.length > 0 ? "," : ""}`
        );
      } else if (provideAccept && optionsExp != null) {
        ms.appendLeft(
          optionsExp.start + 1,
          `\n  provide: { [ECHARTS_KEY]: echarts },`
        );
      }
    }
  }
}

function findEChartsProvideImports(imports: StaticImport[], options: {
  echarts: string;
  provide: string;
}) {
  let hasImportEcharts = false;
  let hasImportProvide = false;

  for (const item of imports) {
    if (item.moduleRequest.value === options.echarts) {
      if (hasImportEcharts) {
        continue;
      }

      hasImportEcharts = item.entries.some((it) => it.localName.value === "echarts");
    } else if (item.moduleRequest.value === "uni-echarts/shared") {
      if (hasImportProvide) {
        continue;
      }

      hasImportProvide = item.entries.some((it) => it.localName.value === options.provide);
    }

    if (hasImportEcharts && hasImportProvide) {
      break;
    }
  }

  return {
    hasImportEcharts,
    hasImportProvide
  };
}

function findOptionsProvide(stmts: (Directive | Statement)[]) {
  let optionsExp: ObjectExpression | null = null;
  let provideExp: ObjectExpression | null = null;
  let provideAccept = false;

  let hasProvideEcharts = false;

  for (const item of stmts) {
    if (item.type !== "ExportDefaultDeclaration") {
      continue;
    }

    optionsExp = getOptionsExp(item);

    if (optionsExp == null || optionsExp.properties.length === 0) {
      break;
    }

    [provideAccept, provideExp] = getOptionsProvideExp(optionsExp.properties);

    if (!provideAccept || provideExp == null || provideExp.properties.length === 0) {
      break;
    }

    hasProvideEcharts = provideExp.properties.some((it) => {
      return it.type === "Property" && it.key.type === "Identifier" && it.key.name === "ECHARTS_KEY";
    });

    break;
  }

  return {
    optionsExp,
    provideExp,
    provideAccept,
    hasProvideEcharts
  };
}

function getOptionsExp(stmt: ExportDefaultDeclaration) {
  if (stmt.declaration.type === "ObjectExpression") {
    return stmt.declaration;
  }

  if (stmt.declaration.type === "CallExpression") {
    const argument = stmt.declaration.arguments[0];

    if (argument == null || argument.type !== "ObjectExpression") {
      return null;
    }

    return argument;
  }

  return null;
}

function getOptionsProvideExp(properties: ObjectPropertyKind[]): [boolean, ObjectExpression | null] {
  for (const item of properties) {
    if (!(item.type === "Property" && item.key.type === "Identifier" && item.key.name === "provide")) {
      continue;
    }

    if (item.value.type === "ObjectExpression") {
      return [true, item.value];
    }

    if (item.value.type === "FunctionExpression" || item.value.type === "ArrowFunctionExpression") {
      if (item.value.body == null) {
        return [false, null];
      }

      if (item.value.body.type === "BlockStatement") {
        const returnStmt = item.value.body.body
          .find((it) => it.type === "ReturnStatement");

        if (returnStmt == null || returnStmt.argument == null || returnStmt.argument.type !== "ObjectExpression") {
          return [false, null];
        }

        return [true, returnStmt.argument];
      }

      if (item.value.body.type === "ParenthesizedExpression") {
        if (item.value.body.expression.type !== "ObjectExpression") {
          return [false, null];
        }

        return [true, item.value.body.expression];
      }
    }

    return [false, null];
  }

  return [true, null];
}