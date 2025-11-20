import { resolve } from "node:path";
import { cwd } from "node:process";
import chalk from "chalk";
import { consola } from "consola";
import { copy, remove } from "fs-extra/esm";

export function r(...paths: string[]) {
  return resolve(cwd(), ".", ...paths);
}

async function main() {
  try {
    consola.info(chalk.cyan("Migrating shared"));

    await Promise.all([
      copy(r("dist", "index.mjs"), r("..", "core", "src", "shared-core.js")),
      copy(r("dist", "index.d.ts"), r("..", "core", "src", "shared-core.d.ts"))
    ]);

    await remove(r("dist"));

    consola.success(chalk.green("Migrate succeeded for shared"));
  } catch (error) {
    consola.error("Migrate failed for `shared`", error);
  }
}

void main();