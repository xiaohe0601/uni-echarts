/* eslint-disable ts/no-empty-object-type */
import type { DefineComponent } from "vue";
import type { AllowedComponentProps } from "../../shared";
import type { UniEchartsEmits, UniEchartsProps } from "./types";

type UniEcharts = DefineComponent<
  AllowedComponentProps & UniEchartsProps,
  {},
  {},
  {},
  {},
  {},
  {},
  UniEchartsEmits
>;

declare const _default: UniEcharts;

export default _default;