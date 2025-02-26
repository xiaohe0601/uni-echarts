import { isEmpty as isEmptyCore } from "lodash";

export function isEmpty(value: unknown) {
  if (["string", "object", "null", "undefined"].includes(typeof value)) {
    return isEmptyCore(value);
  }

  return false;
}