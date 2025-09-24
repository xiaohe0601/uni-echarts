#!/usr/bin/env node

import fs from "node:fs";
import * as process from "node:process";
import { cancel, confirm, intro, isCancel, log, outro, spinner, text } from "@clack/prompts";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import chalk from "chalk";
import minimist from "minimist";
import type { RollupBuild } from "rollup";
import { rollup } from "rollup";

async function c2e(input: string, output: string) {
  let bundle: RollupBuild | null = null;

  try {
    bundle = await rollup({
      input,
      plugins: [
        resolve(),
        commonjs(),
        terser()
        // TODO replace wx to uni
      ]
    });

    await bundle.write({
      file: output,
      format: "esm"
    });
  } finally {
    if (bundle != null) {
      await bundle.close();
    }
  }
}

async function prompt<T extends (...args: any[]) => Promise<any>>(
  func: T,
  options: Parameters<T>[0]
): Promise<Awaited<ReturnType<T>>> {
  const value = await func(options);

  if (isCancel(value)) {
    cancel("Operation cancelled");
    process.exit(0);
  }

  return value;
}

async function main() {
  const argv = minimist(process.argv.slice(2), {
    alias: {
      force: ["f"],
      help: ["h"]
    }
  });

  intro("Uni ECharts Transform CLI");

  log.info(`Transform input ${chalk.cyan("echarts.min.js")} to ESM`);

  if (argv.help) {
    help();
    process.exit(0);
  }

  const input = await prompt(text, {
    message: "Input file",
    placeholder: "./echarts.min.js",
    initialValue: argv._[0],
    validate(value) {
      if (value.length === 0) {
        return new Error("Input file is required.");
      }
      if (!fs.existsSync(value)) {
        return new Error("Input file does not exist.");
      }
      if (!fs.statSync(value).isFile()) {
        return new Error("Input path is not a file.");
      }
    }
  }) as string;

  const output = await prompt(text, {
    message: "Output file",
    placeholder: "./echarts.esm.js",
    initialValue: argv._[1],
    validate(value) {
      if (value.length === 0) {
        return new Error("Output file is required.");
      }
    }
  }) as string;

  if (!argv.force && fs.existsSync(output)) {
    const overwrite = await prompt(confirm, {
      message: `${chalk.cyan(output)} already exists. Overwrite?`
    });

    if (!overwrite) {
      cancel("Operation cancelled. File not overwritten.");
      process.exit(0);
    }
  }

  const s = spinner();

  s.start("Transforming...");

  try {
    await c2e(input, output);

    s.stop("Transform completed!");

    outro(chalk.green(`Output: ${chalk.cyan(fs.realpathSync(output))}`));
  } catch (error: any) {
    s.stop();

    cancel(`Transform failed: ${chalk.red(error.message || error)}`);
    console.error(error);

    process.exit(1);
  }
}

function help() {
  log.info(`
Usage:
  $ c2e [input] [output] [options]

Arguments:
  input     Input file path (e.g., ${chalk.cyan("./echarts.min.js")})
  output    Output file path (e.g., ${chalk.cyan("./echarts.esm.js")})

Options:
  -f, --force   Overwrite output if it exists
  -h, --help    Display this message

Examples:
  $ c2e ./echarts.min.js ./echarts.esm.js
  $ c2e ./echarts.min.js ./echarts.esm.js -f
  $ c2e --help
`.trim());
}

void main();