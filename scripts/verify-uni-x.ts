import { resolve } from "node:path";
import { cwd, exit } from "node:process";
import chalk from "chalk";
import { consola } from "consola";
import { pathExists, readJson } from "fs-extra/esm";

const EXPECTED_PAGE_COUNT = 13;
const EXPECTED_PLATFORMS = {
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
} as const;

function r(...paths: string[]) {
  return resolve(cwd(), ".", ...paths);
}

async function assertPath(path: string, label: string) {
  if (!await pathExists(path)) {
    throw new Error(`${label} is missing: \`${path}\``);
  }
}

function assertEqual(actual: unknown, expected: unknown, label: string) {
  if (actual !== expected) {
    throw new Error(`${label} must be \`${String(expected)}\`, received \`${String(actual)}\``);
  }
}

function assertPlatforms(actual: any) {
  if (actual == null || typeof actual !== "object") {
    throw new Error("`uni_modules.platforms.client.uni-app-x` is missing");
  }

  for (const [platform, targets] of Object.entries(EXPECTED_PLATFORMS)) {
    for (const [target, expected] of Object.entries(targets)) {
      assertEqual(
        actual?.[platform]?.[target],
        expected,
        `platform ${platform}.${target}`
      );
    }
  }
}

async function verify() {
  const playgroundDir = r("playground-x");
  const artifactDir = r(playgroundDir, "uni_modules", "xiaohe-echarts-x");
  const artifactPackagePath = r(artifactDir, "package.json");
  const artifactComponentPath = r(artifactDir, "components", "uni-echarts-x", "uni-echarts-x.uvue");
  const manifestPath = r(playgroundDir, "manifest.json");
  const pagesPath = r(playgroundDir, "pages.json");
  const sourcePackagePath = r("packages", "core-x", "package.json");

  consola.info(chalk.cyan("Verifying uni-app x uni_modules artifact"));

  await assertPath(artifactPackagePath, "Generated package.json");
  await assertPath(artifactComponentPath, "Generated component");
  await assertPath(manifestPath, "playground manifest.json");
  await assertPath(pagesPath, "playground pages.json");

  const artifactPackage = await readJson(artifactPackagePath) as any;
  const sourcePackage = await readJson(sourcePackagePath) as any;
  const manifest = await readJson(manifestPath) as any;
  const pages = await readJson(pagesPath) as any;

  assertEqual(artifactPackage.id, "xiaohe-echarts-x", "artifact id");
  assertEqual(artifactPackage.name, sourcePackage.name, "artifact package name");
  assertEqual(artifactPackage.version, sourcePackage.version, "artifact version");
  assertEqual(artifactPackage.dcloudext?.type, "component-vue", "dcloudext type");
  assertPlatforms(artifactPackage.uni_modules?.platforms?.client?.["uni-app-x"]);

  assertEqual(manifest?.["uni-app-x"]?.vapor, true, "manifest vapor");
  assertEqual(
    manifest?.["uni-app-x"]?.["vapor-render-target"],
    "bytecode",
    "manifest vapor-render-target"
  );

  if (!Array.isArray(pages.pages) || pages.pages.length !== EXPECTED_PAGE_COUNT) {
    throw new Error(`Expected ${EXPECTED_PAGE_COUNT} pages, received ${pages.pages?.length ?? 0}`);
  }

  for (const page of pages.pages) {
    await assertPath(
      r(playgroundDir, `${page.path}.uvue`),
      `Page \`${page.path}\``
    );
  }

  consola.success(chalk.green("uni-app x artifact verification passed"));
}

verify().catch((error) => {
  consola.error("uni-app x artifact verification failed", error);
  exit(1);
});