export type BuiltInPlatform =
  | "app"
  | "app-harmony"
  | "app-plus"
  | "h5"
  | "web"
  | "mp-360"
  | "mp-alipay"
  | "mp-baidu"
  | "mp-harmony"
  | "mp-jd"
  | "mp-kuaishou"
  | "mp-lark"
  | "mp-qq"
  | "mp-toutiao"
  | "mp-weixin"
  | "mp-xhs"
  | "quickapp-webview"
  | "quickapp-webview-huawei"
  | "quickapp-webview-union";

export type AppPlatform = "android" | "ios" | "harmony" | undefined;

// @ts-expect-error whatever
// eslint-disable-next-line node/prefer-global/process
export const platform = process.env.UNI_PLATFORM as BuiltInPlatform;

export const appPlatform = (function (): AppPlatform {
  let plat: AppPlatform;

  // #ifdef APP-ANDROID
  plat = "android";
  // #endif
  // #ifdef APP-IOS
  plat = "ios";
  // #endif
  // #ifdef APP-HARMONY
  plat = "harmony";
  // #endif

  return plat;
})();

/** App */
export const isApp = platform === "app";
/** Web */
export const isWeb = platform === "web" || platform === "h5";
/** 小程序 */
export const isMp = /^mp-/i.test(platform);
/** 快应用 */
export const isQuickapp = /^quickapp-webview/i.test(platform);

/** App Android */
export const isAppAndroid = appPlatform === "android";
/** App iOS */
export const isAppIos = appPlatform === "ios";
/** App HarmonyOS Next */
export const isAppHarmony = appPlatform === "harmony";

/** 360 小程序 */
export const isMp360 = platform === "mp-360";
/** 支付宝小程序 */
export const isMpAlipay = platform === "mp-alipay";
/** 百度小程序 */
export const isMpBaidu = platform === "mp-baidu";
/** 鸿蒙元服务 */
export const isMpHarmony = platform === "mp-harmony";
/** 京东小程序 */
export const isMpJd = platform === "mp-jd";
/** 快手小程序 */
export const isMpKuaishou = platform === "mp-kuaishou";
/** 飞书小程序 */
export const isMpLark = platform === "mp-lark";
/** QQ 小程序 */
export const isMpQq = platform === "mp-qq";
/** 头条小程序 */
export const isMpToutiao = platform === "mp-toutiao";
/** 微信小程序 */
export const isMpWeixin = platform === "mp-weixin";
/** 小红书小程序 */
export const isMpXhs = platform === "mp-xhs";

/** 华为快应用 */
export const isQuickappHuawei = platform === "quickapp-webview-huawei";
/** 快应用联盟 */
export const isQuickappUnion = platform === "quickapp-webview-union";