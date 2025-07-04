export type OptionalValue<T> = T | undefined;
export type NullableValue<T> = T | null;

export type ExtractValue<T> = T[keyof T];