import { defineBuildConfig } from "unbuild";
import { keepComments } from "./plugins/keep-comments";

export default defineBuildConfig({
  entries: [
    "src/index.ts"
  ],
  clean: true,
  declaration: true,
  externals: [
    "echarts/core",
    "vue"
  ],
  hooks: {
    "rollup:options": (_, options) => {
      options.plugins.push(
        keepComments({
          include: [
            "// #ifdef",
            "// #ifndef",
            "// #endif"
          ]
        })
      );
    }
  }
});