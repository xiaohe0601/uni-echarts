import { resolve } from "node:path";
import { cwd, exit } from "node:process";
import chalk from "chalk";
import { consola } from "consola";
import { copy, emptyDir, outputFile } from "fs-extra/esm";
import pkg from "../packages/core-x/package.json";

const uniPkg = {
  id: "xiaohe-echarts-x",
  name: pkg.name,
  displayName: "Uni ECharts x",
  type: pkg.type,
  version: pkg.version,
  description: "适用于 uni-app x 蒸汽模式（Vapor）的 ECharts 组件，持续验证中。",
  author: pkg.author,
  license: pkg.license,
  homepage: pkg.homepage,
  repository: "https://github.com/xiaohe0601/uni-echarts",
  bugs: pkg.bugs,
  dcloudext: {
    type: "component-vue",
    sale: {
      regular: {
        price: "0.00"
      },
      sourcecode: {
        price: "0.00"
      }
    },
    contact: {
      qq: ""
    },
    declaration: {
      ads: "无",
      data: "无",
      permissions: "无"
    },
    npmurl: "https://www.npmjs.com/package/uni-echarts-x",
    darkmode: "√",
    i18n: "√",
    widescreen: "√"
  },
  uni_modules: {
    dependencies: [],
    encrypt: [],
    platforms: {
      client: {
        "uni-app-x": {
          web: {
            safari: "√",
            chrome: "√"
          },
          app: {
            android: "√",
            ios: "√",
            harmony: "√"
          },
          mp: {
            weixin: "√"
          }
        }
      }
    }
  }
};

function r(...paths: string[]) {
  return resolve(cwd(), ".", ...paths);
}

async function build() {
  const fromDir = r("packages", "core-x");
  const destDir = r("playground-x", "uni_modules", uniPkg.id);

  try {
    consola.info(chalk.cyan("Building uni-app x uni_modules"));
    consola.info(`Cleaning dest directory: \`${destDir}\``);
    await emptyDir(destDir);

    const srcDir = r(fromDir, "src");
    consola.info(`Copying source directory: \`${srcDir}\``);
    await copy(srcDir, destDir);

    consola.info(`Writing package.json: \`${uniPkg.id}\``);
    await outputFile(r(destDir, "package.json"), JSON.stringify(uniPkg, null, 2));

    consola.success(chalk.green("Build succeeded for uni-app x uni_modules"));
  } catch (error) {
    consola.error("Build failed for uni-app x `uni_modules`", error);
    exit(1);
  }
}

build();