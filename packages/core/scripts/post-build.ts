import { resolve } from "node:path";
import { cwd } from "node:process";
import chalk from "chalk";
import { consola } from "consola";
import { remove } from "fs-extra";

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

    consola.success(chalk.green("Simplify succeeded for dist"));
  } catch (error) {
    consola.error("Simplify failed for `dist`", error);
  }
}

main();