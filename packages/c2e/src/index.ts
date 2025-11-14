import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import MagicString from "magic-string";
import type { Plugin, RollupBuild, RollupOutput } from "rollup";
import { rollup } from "rollup";

export interface C2eWriteOptions {
  write: true;
  input: string;
  output: string;
}

export interface C2eGenOptions {
  write: false;
  code: string;
}

export type C2eOptions = C2eWriteOptions | C2eGenOptions;

const PLATFORM_POLYFILL_CODE = `
var wx = (function () {
  if(typeof wx !== "undefined") return wx;
  if(typeof qh !== "undefined") return qh;
  if(typeof my !== "undefined") return my;
  if(typeof swan !== "undefined") return swan;
  if(typeof dd !== "undefined") return dd;
  if(typeof jd !== "undefined") return jd;
  if(typeof ks !== "undefined") return ks;
  if(typeof tt !== "undefined") return tt;
  if(typeof qq !== "undefined") return qq;
  if(typeof xhs !== "undefined") return xhs;
  if(typeof qa !== "undefined") return qa;
  if(typeof uni !== "undefined") return uni;
  return null;
})();`.trim();

export function c2e(options: C2eWriteOptions): Promise<undefined>;
export function c2e(options: C2eGenOptions): Promise<RollupOutput>;
export async function c2e(options: C2eOptions) {
  let bundle: RollupBuild | null = null;

  try {
    const input = options.write ? options.input : "virtual-input.js";

    const context: {
      id: string | null;
    } = {
      id: null
    };

    const plugins: Plugin[] = [
      {
        name: "wx-to-xx",
        resolveId(source) {
          context.id = source;
          return null;
        },
        transform(code, id) {
          if (id !== input && id !== context.id) {
            return;
          }

          const ms = new MagicString(code);

          const match = code.match(/(["'])use strict\1;/);

          if (match != null && match.index != null) {
            ms.appendRight(
              match.index + match[0].length,
              PLATFORM_POLYFILL_CODE
            );
          }

          return {
            code: ms.toString(),
            map: ms.generateMap()
          };
        }
      },
      resolve(),
      commonjs(),
      terser()
    ];

    if (!options.write) {
      plugins.unshift({
        name: "virtual-input",
        resolveId(source) {
          if (source !== input) {
            return null;
          }

          return input;
        },
        load(id) {
          if (id !== input) {
            return null;
          }

          return options.code;
        }
      } satisfies Plugin);
    }

    bundle = await rollup({
      input,
      plugins
    });

    if (options.write) {
      await bundle.write({
        file: options.output,
        format: "esm"
      });
    } else {
      return bundle.generate({
        format: "esm"
      });
    }
  } finally {
    if (bundle != null) {
      await bundle.close();
    }
  }
}