// noinspection JSUnusedAssignment

export const Platform = {
  APP: "APP",
  APP_ANDROID: "APP-ANDROID",
  APP_IOS: "APP-IOS",
  APP_HARMONY: "APP-HARMONY",
  WEB: "WEB",
  MP: "MP",
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
  QUICKAPP_WEBVIEW: "QUICKAPP-WEBVIEW",
  QUICKAPP_WEBVIEW_UNION: "QUICKAPP-WEBVIEW-UNION",
  QUICKAPP_WEBVIEW_HUAWEI: "QUICKAPP-WEBVIEW-HUAWEI",
  OTHER: "OTHER"
};

export function getPlatform() {
  let platform = Platform.OTHER;

  // #ifdef APP
  platform = Platform.APP;
  // #endif
  // #ifdef APP-ANDROID
  platform = Platform.APP_ANDROID;
  // #endif
  // #ifdef APP-IOS
  platform = Platform.APP_IOS;
  // #endif
  // #ifdef APP-HARMONY
  platform = Platform.APP_HARMONY;
  // #endif
  // #ifdef WEB
  platform = Platform.WEB;
  // #endif
  // #ifdef MP
  platform = Platform.MP;
  // #endif
  // #ifdef MP-WEIXIN
  platform = Platform.MP_WEIXIN;
  // #endif
  // #ifdef MP-ALIPAY
  platform = Platform.MP_ALIPAY;
  // #endif
  // #ifdef MP-BAIDU
  platform = Platform.MP_BAIDU;
  // #endif
  // #ifdef MP-TOUTIAO
  platform = Platform.MP_TOUTIAO;
  // #endif
  // #ifdef MP-LARK
  platform = Platform.MP_LARK;
  // #endif
  // #ifdef MP-QQ
  platform = Platform.MP_QQ;
  // #endif
  // #ifdef MP-KUAISHOU
  platform = Platform.MP_KUAISHOU;
  // #endif
  // #ifdef MP-JD
  platform = Platform.MP_JD;
  // #endif
  // #ifdef MP-360
  platform = Platform.MP_360;
  // #endif
  // #ifdef MP-XHS
  platform = Platform.MP_XHS;
  // #endif
  // #ifdef MP-HARMONY
  platform = Platform.MP_HARMONY;
  // #endif
  // #ifdef QUICKAPP-WEBVIEW
  platform = Platform.QUICKAPP_WEBVIEW;
  // #endif
  // #ifdef QUICKAPP-WEBVIEW-UNION
  platform = Platform.QUICKAPP_WEBVIEW_UNION;
  // #endif
  // #ifdef QUICKAPP-WEBVIEW-HUAWEI
  platform = Platform.QUICKAPP_WEBVIEW_HUAWEI;
  // #endif

  return platform;
}

export const platform = getPlatform();

/** App */
export const isApp = platform === Platform.APP;
/** App Android */
export const isAppAndroid = platform === Platform.APP_ANDROID;
/** App iOS */
export const isAppIos = platform === Platform.APP_IOS;
/** App HarmonyOS Next */
export const isAppHarmony = platform === Platform.APP_HARMONY;
/** Web */
export const isWeb = platform === Platform.WEB;
/** 小程序 */
export const isMp = platform === Platform.MP;
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
/** QQ小程序 */
export const isMpQq = platform === Platform.MP_QQ;
/** 快手小程序 */
export const isMpKuaishou = platform === Platform.MP_KUAISHOU;
/** 京东小程序 */
export const isMpJd = platform === Platform.MP_JD;
/** 360小程序 */
export const isMp360 = platform === Platform.MP_360;
/** 小红书小程序 */
export const isMpXhs = platform === Platform.MP_XHS;
/** 鸿蒙元服务 */
export const isMpHarmony = platform === Platform.MP_HARMONY;
/** 快应用 */
export const isQuickappWebview = platform === Platform.QUICKAPP_WEBVIEW;
/** 快应用联盟 */
export const isQuickappWebviewUnion = platform === Platform.QUICKAPP_WEBVIEW_UNION;
/** 快应用华为 */
export const isQuickappWebviewHuawei = platform === Platform.QUICKAPP_WEBVIEW_HUAWEI;
/** 其他平台 */
export const isOtherPlatform = platform === Platform.OTHER;