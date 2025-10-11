import type { ExtractValue } from "../types";

export const PlatformGroup = {
  WEB: "WEB",
  APP: "APP",
  MP: "MP",
  QUICKAPP_WEBVIEW: "QUICKAPP-WEBVIEW"
} as const;

export type PlatformGroupType = ExtractValue<typeof PlatformGroup>;

export const Platform = {
  APP_ANDROID: "APP-ANDROID",
  APP_IOS: "APP-IOS",
  APP_HARMONY: "APP-HARMONY",
  MP_WEIXIN: "MP-WEIXIN",
  MP_ALIPAY: "MP-ALIPAY",
  MP_BAIDU: "MP-BAIDU",
  MP_TOUTIAO: "MP-TOUTIAO",
  MP_LARK: "MP-LARK",
  MP_QQ: "MP-QQ",
  MP_KUAISHOU: "MP-KUAISHOU",
  MP_JD: "MP-JD",
  MP_360: "MP-360",
  MP_XHS: "MP-XHS",
  MP_HARMONY: "MP-HARMONY",
  QUICKAPP_WEBVIEW_UNION: "QUICKAPP-WEBVIEW-UNION",
  QUICKAPP_WEBVIEW_HUAWEI: "QUICKAPP-WEBVIEW-HUAWEI",
  UNKNOWN: "UNKNOWN"
} as const;

export type PlatformType = ExtractValue<typeof Platform>;

export function getPlatformGroup(): PlatformGroupType {
  let plat: PlatformGroupType = PlatformGroup.WEB;

  // #ifdef WEB || H5
  plat = PlatformGroup.WEB;
  // #endif
  // #ifdef APP
  plat = PlatformGroup.APP;
  // #endif
  // #ifdef MP
  plat = PlatformGroup.MP;
  // #endif
  // #ifdef QUICKAPP-WEBVIEW
  plat = PlatformGroup.QUICKAPP_WEBVIEW;
  // #endif

  return plat;
}

export const platformGroup = getPlatformGroup();

export function getPlatform(): PlatformType {
  let plat: PlatformType = Platform.UNKNOWN;

  // #ifdef APP-ANDROID
  plat = Platform.APP_ANDROID;
  // #endif
  // #ifdef APP-IOS
  plat = Platform.APP_IOS;
  // #endif
  // #ifdef APP-HARMONY
  plat = Platform.APP_HARMONY;
  // #endif
  // #ifdef MP-WEIXIN
  plat = Platform.MP_WEIXIN;
  // #endif
  // #ifdef MP-ALIPAY
  plat = Platform.MP_ALIPAY;
  // #endif
  // #ifdef MP-BAIDU
  plat = Platform.MP_BAIDU;
  // #endif
  // #ifdef MP-TOUTIAO
  plat = Platform.MP_TOUTIAO;
  // #endif
  // #ifdef MP-LARK
  plat = Platform.MP_LARK;
  // #endif
  // #ifdef MP-QQ
  plat = Platform.MP_QQ;
  // #endif
  // #ifdef MP-KUAISHOU
  plat = Platform.MP_KUAISHOU;
  // #endif
  // #ifdef MP-JD
  plat = Platform.MP_JD;
  // #endif
  // #ifdef MP-360
  plat = Platform.MP_360;
  // #endif
  // #ifdef MP-XHS
  plat = Platform.MP_XHS;
  // #endif
  // #ifdef MP-HARMONY
  plat = Platform.MP_HARMONY;
  // #endif
  // #ifdef QUICKAPP-WEBVIEW-UNION
  plat = Platform.QUICKAPP_WEBVIEW_UNION;
  // #endif
  // #ifdef QUICKAPP-WEBVIEW-HUAWEI
  plat = Platform.QUICKAPP_WEBVIEW_HUAWEI;
  // #endif

  return plat;
}

export const platform = getPlatform();

/** Web */
export const isWeb = platformGroup === PlatformGroup.WEB;
/** App */
export const isApp = platformGroup === PlatformGroup.APP;
/** 小程序 */
export const isMp = platformGroup === PlatformGroup.MP;
/** 快应用 */
export const isQuickappWebview = platformGroup === PlatformGroup.QUICKAPP_WEBVIEW;

/** App Android */
export const isAppAndroid = platform === Platform.APP_ANDROID;
/** App iOS */
export const isAppIos = platform === Platform.APP_IOS;
/** App HarmonyOS Next */
export const isAppHarmony = platform === Platform.APP_HARMONY;
/** 微信小程序 */
export const isMpWeixin = platform === Platform.MP_WEIXIN;
/** 支付宝小程序 */
export const isMpAlipay = platform === Platform.MP_ALIPAY;
/** 百度小程序 */
export const isMpBaidu = platform === Platform.MP_BAIDU;
/** 头条小程序 */
export const isMpToutiao = platform === Platform.MP_TOUTIAO;
/** 飞书小程序 */
export const isMpLark = platform === Platform.MP_LARK;
/** QQ 小程序 */
export const isMpQq = platform === Platform.MP_QQ;
/** 快手小程序 */
export const isMpKuaishou = platform === Platform.MP_KUAISHOU;
/** 京东小程序 */
export const isMpJd = platform === Platform.MP_JD;
/** 360 小程序 */
export const isMp360 = platform === Platform.MP_360;
/** 小红书小程序 */
export const isMpXhs = platform === Platform.MP_XHS;
/** 鸿蒙元服务 */
export const isMpHarmony = platform === Platform.MP_HARMONY;
/** 快应用联盟 */
export const isQuickappWebviewUnion = platform === Platform.QUICKAPP_WEBVIEW_UNION;
/** 华为快应用 */
export const isQuickappWebviewHuawei = platform === Platform.QUICKAPP_WEBVIEW_HUAWEI;
/** 未知平台 */
export const isUnknownPlatform = platform === Platform.UNKNOWN;