import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: [
    "src/index.ts"
  ],
  clean: true,
  externals: [
    "@clack/prompts",
    "@rollup/plugin-commonjs",
    "@rollup/plugin-node-resolve",
    "@rollup/plugin-terser",
    "chalk",
    "minimist",
    "rollup"
  ],
  rollup: {
    emitCJS: true
  }
});