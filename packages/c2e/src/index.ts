import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import type { RollupBuild, RollupOutput } from "rollup";
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

export function c2e(options: C2eWriteOptions): Promise<undefined>;
export function c2e(options: C2eGenOptions): Promise<RollupOutput>;
export async function c2e(options: C2eOptions) {
  let bundle: RollupBuild | null = null;

  try {
    const input = options.write ? options.input : "virtual-input.js";

    const plugins = [
      resolve(),
      commonjs(),
      terser()
      // TODO replace wx to uni
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
      });
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