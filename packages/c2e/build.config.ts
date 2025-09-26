import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: [
    "src/index.ts",
    "src/cli.ts"
  ],
  clean: true,
  declaration: true,
  externals: [
    "@clack/prompts",
    "@rollup/plugin-commonjs",
    "@rollup/plugin-node-resolve",
    "@rollup/plugin-terser",
    "chalk",
    "magic-string",
    "minimist",
    "rollup"
  ],
  rollup: {
    emitCJS: true
  }
});