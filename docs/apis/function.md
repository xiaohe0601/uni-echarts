# 函数

## provideEcharts

```ts
import type * as Echarts from "echarts/core";

export type CoreEcharts = typeof Echarts;

declare function provideEcharts(echarts: CoreEcharts): void;
```

## provideEchartsTheme

```ts
type NullableValue<T> = T | null;

type Injection<T> = MaybeRefOrGetter<NullableValue<T>>;

type InitType = typeof init;
type InitParameters = Parameters<InitType>;

type ChartTheme = NonNullable<InitParameters[1]>;
type ChartThemeInjection = Injection<ChartTheme>;

declare function provideEchartsTheme(value: ChartThemeInjection): void;
```

## provideEchartsOption

```ts
type NullableValue<T> = T | null;

type Injection<T> = MaybeRefOrGetter<NullableValue<T>>;

type SetOptionType = EChartsType["setOption"];

type ChartOption = Parameters<SetOptionType>[0];
type ChartOptionInjection = Injection<ChartOption>;

declare function provideEchartsOption(value: ChartOptionInjection): void;
declare function provideEchartsOption(key: string, value: ChartOptionInjection): void;
declare function provideEchartsOption(keyOrValue: string | ChartOptionInjection, value?: ChartOptionInjection): void;
```

## provideEchartsInitOptions

```ts
type NullableValue<T> = T | null;

type Injection<T> = MaybeRefOrGetter<NullableValue<T>>;

type InitType = typeof init;
type InitParameters = Parameters<InitType>;

type InitOptions = NonNullable<InitParameters[2]>;
type InitOptionsInjection = Injection<InitOptions>;

declare function provideEchartsInitOptions(value: InitOptionsInjection): void;
```

## provideEchartsUpdateOptions

```ts
type NullableValue<T> = T | null;

type Injection<T> = MaybeRefOrGetter<NullableValue<T>>;

type UpdateOptions = SetOptionOpts;
type UpdateOptionsInjection = Injection<UpdateOptions>;

declare function provideEchartsUpdateOptions(value: UpdateOptionsInjection): void;
```

## provideEchartsLoadingOptions

```ts
type NullableValue<T> = T | null;

type Injection<T> = MaybeRefOrGetter<NullableValue<T>>;

interface LoadingOptions {
  text?: string;
  textColor?: string;
  fontSize?: number | string;
  fontWeight?: number | string;
  fontStyle?: string;
  fontFamily?: string;
  maskColor?: string;
  showSpinner?: boolean;
  color?: string;
  spinnerRadius?: number;
  lineWidth?: number;
  zlevel?: number;
}

type LoadingOptionsInjection = Injection<LoadingOptions>;

declare function provideEchartsLoadingOptions(value: LoadingOptionsInjection): void;
```