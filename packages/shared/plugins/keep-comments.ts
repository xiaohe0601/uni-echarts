import type { Plugin } from "rollup";

export interface KeepCommentsOptions {
  include?: string[];
}

export function keepComments(options: KeepCommentsOptions = {}): Plugin {
  const pattern = new RegExp(
    `(${options.include?.map((s) => s.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1")).join("|")})`
  );
  return {
    name: "keep-comments",

    transform: {
      order: "pre",
      async handler(code, _) {
        const lines = code.split("\n");
        let changed = false;
        for (let i = 0; i < lines.length; i++) {
          const ln = lines[i];
          if (pattern.test(ln) && !ln.trimStart().startsWith("//!")) {
            lines[i] = ln.replace("//", "//!");
            changed = true;
          }
        }
        if (changed) {
          return { code: lines.join("\n"), map: null };
        }
        return null;
      }
    },
    // 第二阶段：在最终输出 bundle 里还原注释
    generateBundle(_, bundle) {
      for (const [_, chunk] of Object.entries(bundle)) {
        if (chunk.type === "chunk" && typeof chunk.code === "string") {
          if (chunk.code.includes("//!")) {
            chunk.code = chunk.code.replace(
              /^([ \t]*)\/\/!(?=[ \t]*#)/gm,
              (_, indent) => `${indent}// `
            );
          }
        }
      }
    }
  };
}