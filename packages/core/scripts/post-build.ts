import { resolve } from "node:path";
import { cwd } from "node:process";
import chalk from "chalk";
import { consola } from "consola";
import { copy, remove } from "fs-extra";

export function r(...paths: string[]) {
  return resolve(cwd(), ".", ...paths);
}

async function main() {
  try {
    consola.info(chalk.cyan("Simplifying dist"));

    await Promise.all([
      remove(r("dist", "index.mjs")),
      remove(r("dist", "index.d.mts"))
    ]);

    await copy(r("dist-resolver", "resolver"), r("dist-resolver"));
    await remove(r("dist-resolver", "resolver"));

    consola.success(chalk.green("Simplify succeeded for dist"));
  } catch (error) {
    consola.error("Simplify failed for `dist`", error);
  }

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