#!/usr/bin/env node

import fs from "node:fs";
import process from "node:process";
import { cancel, confirm, intro, isCancel, log, outro, spinner, text } from "@clack/prompts";
import chalk from "chalk";
import minimist from "minimist";
import { c2e } from "./index";

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
    placeholder: "Path to input file",
    initialValue: argv._[0] || "./echarts.min.js",
    validate(value) {
      if (value == null || value.length === 0) {
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
    placeholder: "Path to output file",
    initialValue: argv._[1] || "./echarts.esm.js",
    validate(value) {
      if (value == null || value.length === 0) {
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
    await c2e({
      write: true,
      input,
      output
    });

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
  $ uni-echarts-c2e [input] [output] [options]

Arguments:
  input     Input file path (e.g., ./echarts.min.js)
  output    Output file path (e.g., ./echarts.esm.js)

Options:
  -f, --force   Overwrite output if it exists
  -h, --help    Display this message

Examples:
  $ uni-echarts-c2e
  $ uni-echarts-c2e ./echarts.min.js ./echarts.esm.js
  $ uni-echarts-c2e ./echarts.min.js ./echarts.esm.js -f
  $ uni-echarts-c2e --help
`.trim());
}

void main();