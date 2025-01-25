import type { VueThis } from "../composables/useVueThis";

export declare function getDeviceInfo(): UniApp.GetDeviceInfoResult | UniApp.GetSystemInfoResult;

export declare function getWindowInfo(): UniApp.GetWindowInfoResult | UniApp.GetSystemInfoResult;

export declare function getAppBaseInfo(): UniApp.GetAppBaseInfoResult | UniApp.GetSystemInfoResult;

export declare function getVersion(): string;

export declare function compareVersion(v1: string, v2: string): 0 | 1 | -1;

export declare function canIUseCanvas2d(): boolean;

export declare function querySelect(
  component: VueThis,
  selector: string,
  fields: UniApp.NodeField
): Promise<UniApp.NodeInfo>;