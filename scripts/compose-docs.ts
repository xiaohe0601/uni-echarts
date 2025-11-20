import { resolve } from "node:path";
import { cwd } from "node:process";
import chalk from "chalk";
import { consola } from "consola";
import { copy, emptyDir } from "fs-extra/esm";

export function r(...paths: string[]) {
  return resolve(cwd(), ".", ...paths);
}

async function main() {
  const fromDir = r("playground", "dist", "build", "h5");
  const destDir = r("docs", ".vitepress", "dist", "ui");

  try {
    consola.info(chalk.cyan("Composing docs"));

    consola.info(`Cleaning dest directory: \`${destDir}\``);
    await emptyDir(destDir);

    consola.info(`Copying main directory: \`${fromDir}\``);
    await copy(fromDir, destDir);

    consola.success(chalk.green("Compose succeeded for docs"));
  } catch (error) {
    consola.error("Compose failed for `docs`", error);
  }
}

void main();