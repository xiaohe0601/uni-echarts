declare global {
  type OptionalValue<T> = T | undefined;
  type OptionalNumber = OptionalValue<number>;
  type OptionalString = OptionalValue<string>;
  type OptionalBoolean = OptionalValue<boolean>;

  type NullableValue<T> = T | null;
  type NullableNumber = NullableValue<number>;
  type NullableString = NullableValue<string>;
  type NullableBoolean = NullableValue<boolean>;

  type Arrayable<T> = T | T[];
  type Awaitable<T> = T | Promise<T>;
}

export {};