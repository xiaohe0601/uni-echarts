import { defineBuildConfig } from "unbuild";
import { keepComments } from "./plugins/keep-comments";

export default defineBuildConfig({
  entries: [
    "src/index.ts"
  ],
  clean: false,
  declaration: true,
  externals: [
    "echarts",
    "vue"
  ],
  hooks: {
    "rollup:options": (_, options) => {
      options.plugins.push(
        keepComments({
          comments: [
            "// #ifdef",
            "// #ifndef",
            "// #endif"
          ]
        })
      );
    }
  }
});