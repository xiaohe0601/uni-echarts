import { resolve } from "node:path";
import { cwd } from "node:process";
import chalk from "chalk";
import { consola } from "consola";
import { copy, emptyDir } from "fs-extra";
import pkg from "./package.json";

export function r(...paths: string[]) {
  return resolve(cwd(), ".", ...paths);
}

async function build() {
  const fromDir = r("packages", "core");
  const destDir = r("playground", "src", "uni_modules", pkg.id);

  try {
    consola.info(chalk.cyan("Building uni_modules"));

    consola.info(`Cleaning dest directory: \`${destDir}\``);
    await emptyDir(destDir);

    const srcDir = r(fromDir, "src");
    consola.info(`Copying main directory: \`${srcDir}\``);
    await copy(srcDir, destDir);

    const dtsDir = r(fromDir, "dist", "index.d.ts");
    consola.info(`Copying dts: \`${dtsDir}\``);
    await copy(dtsDir, r(destDir, "index.d.ts"));

    const pkgDir = r("scripts", "uni", "package.json");
    consola.info(`Copying package.json: \`${pkgDir}\``);
    await copy(pkgDir, r(destDir, "package.json"));

    const readmeDir = r(fromDir, "README.md");
    consola.info(`Copying README.md: \`${readmeDir}\``);
    await copy(readmeDir, r(destDir, "readme.md"));

    const licenseDir = r("LICENSE");
    consola.info(`Copying LICENSE: \`${licenseDir}\``);
    await copy(licenseDir, r(destDir, "license.md"));

    // TODO
    // const changelogDir = r("CHANGELOG.md");
    // consola.info(`Copying CHANGELOG.md: \`${changelogDir}\``);
    // await copy(changelogDir, r(destDir, "changelog.md"));

    consola.success(chalk.green("Building succeeded for uni_modules"));
  } catch (error) {
    consola.error("Building failed for `uni_modules`", error);
  }
}

build();