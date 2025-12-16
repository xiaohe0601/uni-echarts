import { resolve } from "node:path";
import { cwd } from "node:process";
import chalk from "chalk";
import { consola } from "consola";
import { copy } from "fs-extra/esm";

export function r(...paths: string[]) {
  return resolve(cwd(), ".", ...paths);
}

async function main() {
  try {
    consola.info(chalk.cyan("Copying README"));

    await copy(
      r("..", "..", "README.md"),
      r("README.md")
    );

    consola.success(chalk.green("Copy succeeded for README"));
  } catch (error) {
    consola.error("Copy failed for `README`", error);
  }
}

void main();