import type { Plugin } from "rollup";

export interface KeepCommentsOptions {
  include?: string[];
}

export function keepComments(options: KeepCommentsOptions = {}): Plugin {
  return {
    name: "keep-comments"
  };
}