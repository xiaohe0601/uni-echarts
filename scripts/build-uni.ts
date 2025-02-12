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
  description: "适用于uni-app的Apache ECharts组件（仅支持Vue 3）",
  author: pkg.author,
  license: pkg.license,
  homepage: pkg.homepage,
  repository: "https://gitee.com/xiaohe0601/uni-echarts",
  bugs: pkg.bugs,
  keywords: pkg.keywords,
  dcloudext: {
    category: ["前端组件", "通用组件"],
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
    npmurl: "https://www.npmjs.com/package/uni-echarts"
  },
  uni_modules: {
    dependencies: [],
    encrypt: [],
    platforms: {
      client: {
        "App": {
          "app-vue": "y",
          "app-uvue": "n",
          "app-nvue": "n",
          "app-harmony": "y"
        },
        "H5-mobile": {
          "Safari": "y",
          "Android Browser": "y",
          "微信浏览器(Android)": "y",
          "QQ浏览器(Android)": "y"
        },
        "H5-pc": {
          "Chrome": "y",
          "IE": "n",
          "Edge": "y",
          "Firefox": "y",
          "Safari": "y"
        },
        "Vue": {
          "vue2": "n",
          "vue3": "y"
        },
        "小程序": {
          "微信": "y",
          "阿里": "y",
          "百度": "y",
          "字节跳动": "y",
          "QQ": "y",
          "钉钉": "y",
          "快手": "y",
          "飞书": "y",
          "京东": "y"
        },
        "快应用": {
          "华为": "y",
          "联盟": "y"
        }
      },
      cloud: {
        "aliyun": "y",
        "tcb": "y",
        "alipay": "y"
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