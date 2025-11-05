import { resolve } from "node:path";
import { cwd } from "node:process";
import chalk from "chalk";
import { consola } from "consola";
import { copy, emptyDir, outputFile } from "fs-extra";
import pkg from "../packages/core/package.json";

// noinspection JSNonASCIINames
const uniPkg = {
  id: "xiaohe-echarts",
  name: pkg.name,
  displayName: "xiaohe-echarts",
  type: pkg.type,
  version: pkg.version,
  description: "适用于 uni-app 的 ECharts 组件，支持 Web、小程序、APP，支持鸿蒙，支持 TypeScript。与 Vue ECharts 近乎一致的使用体验！",
  author: pkg.author,
  license: pkg.license,
  homepage: pkg.homepage,
  repository: "https://github.com/xiaohe0601/uni-echarts",
  bugs: pkg.bugs,
  keywords: pkg.keywords,
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
    npmurl: "https://www.npmjs.com/package/uni-echarts",
    darkmode: "√",
    i18n: "√",
    widescreen: "√"
  },
  uni_modules: {
    dependencies: [],
    encrypt: [],
    platforms: {
      client: {
        "uni-app": {
          "vue": {
            "vue2": "x",
            "vue3": "√"
          },
          "web": {
            "safari": "√",
            "chrome": "√"
          },
          "app": {
            "vue": "√",
            "nvue": "x",
            "android": "√",
            "ios": "√",
            "harmony": "√"
          },
          "mp": {
            "weixin": "√",
            "alipay": "√",
            "toutiao": "√",
            "baidu": "√",
            "kuaishou": "√",
            "jd": "√",
            "harmony": "√",
            "qq": "√",
            "lark": "√"
          },
          "quickapp": {
            "huawei": "√",
            "union": "√"
          }
        },
        "uni-app-x": {
          "web": {
            "safari": "x",
            "chrome": "x"
          },
          "app": {
            "android": "x",
            "ios": "x",
            "harmony": "x"
          },
          "mp": {
            "weixin": "x"
          }
        }
      },
      cloud: {
        "aliyun": "√",
        "tcb": "√",
        "alipay": "√"
      }
    }
  }
};

export function r(...paths: string[]) {
  return resolve(cwd(), ".", ...paths);
}

async function build() {
  const fromDir = r("packages", "core");
  const destDir = r("playground", "src", "uni_modules", uniPkg.id);

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

    consola.info(`Writing package.json: \`${uniPkg.id}\``);
    await outputFile(r(destDir, "package.json"), JSON.stringify(uniPkg, null, 2));

    const readmeDir = r(fromDir, "README.md");
    consola.info(`Copying README.md: \`${readmeDir}\``);
    await copy(readmeDir, r(destDir, "readme.md"));

    const licenseDir = r("LICENSE");
    consola.info(`Copying LICENSE: \`${licenseDir}\``);
    await copy(licenseDir, r(destDir, "license.md"));

    consola.success(chalk.green("Build succeeded for uni_modules"));
  } catch (error) {
    consola.error("Build failed for `uni_modules`", error);
  }
}

build();