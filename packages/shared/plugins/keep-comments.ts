import type { Plugin } from "rollup";

export interface KeepCommentsOptions {
  comments?: string[];
}

const KEEP_KEY = "__KP__";

export function keepComments(options: KeepCommentsOptions = {}): Plugin {
  const {
    comments = []
  } = options;

  return {
    name: "keep-comments",
    transform: {
      order: "pre",
      handler(code) {
        return {
          code: code.replace(
            /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g,
            (chunk) => {
              for (const item of comments) {
                if (!chunk.startsWith(item)) {
                  continue;
                }

                // // -> //!__KP__
                // /* -> /*!__KP__
                return `${chunk.slice(0, 2)}!${KEEP_KEY}${chunk.slice(2)}`;
              }

              return chunk;
            }
          )
        };
      }
    },
    generateBundle(_, bundle) {
      for (const chunk of Object.values(bundle)) {
        if (chunk.type !== "chunk") {
          continue;
        }

        chunk.code = chunk.code
          .replace(new RegExp(`/\\*!${KEEP_KEY}(.*?)\\*/`, "gs"), "/*$1*/")
          .replace(new RegExp(`//!${KEEP_KEY}(.*)`, "g"), "//$1");
      }
    }
  };
}