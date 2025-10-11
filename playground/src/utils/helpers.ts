import { isString } from "es-toolkit";
import { isEmpty as isEmptyCore, isObjectLike } from "es-toolkit/compat";

export function sleep(timeout?: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

export function defaultTo<T = any>(value: unknown, ...defaultValues: unknown[]): T {
  if (defaultValues.length === 0) {
    return value as T;
  }

  // eslint-disable-next-line no-self-compare
  if (value == null || value !== value) {
    return defaultTo(defaultValues[0], ...defaultValues.slice(1));
  }

  return value as T;
}

export function isEmpty(value: unknown) {
  if (value == null) {
    return true;
  }

  if (isString(value) || isObjectLike(value)) {
    return isEmptyCore(value);
  }

  return false;
}

export function withDefaultValue<T = any>(value: unknown, defaultValue: unknown = "-"): T {
  if (isEmpty(value)) {
    return defaultValue as T;
  }

  return value as T;
}