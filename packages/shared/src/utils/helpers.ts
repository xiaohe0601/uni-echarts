export function isEmpty(value: unknown): boolean {
  if (value == null) {
    return true;
  }

  if (typeof value === "string" || Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === "object") {
    return Object.keys(value).length === 0;
  }

  return false;
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

export function sleep(timeout?: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

export function upperFirst(value: string): string {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

export function lowerFirst(value: string): string {
  return `${value.charAt(0).toLowerCase()}${value.slice(1)}`;
}