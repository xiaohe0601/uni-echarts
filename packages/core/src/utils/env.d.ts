interface IPlatform {
  APP: "APP";
  APP_ANDROID: "APP-ANDROID";
  APP_IOS: "APP-IOS";
  APP_HARMONY: "APP-HARMONY";
  WEB: "WEB";
  MP: "MP";
  MP_WEIXIN: "MP-WEIXIN";
  MP_ALIPAY: "MP-ALIPAY";
  MP_BAIDU: "MP-BAIDU";
  MP_TOUTIAO: "MP-TOUTIAO";
  MP_LARK: "MP-LARK";
  MP_QQ: "MP-QQ";
  MP_KUAISHOU: "MP-KUAISHOU";
  MP_JD: "MP-JD";
  MP_360: "MP-360";
  MP_XHS: "MP-XHS";
  MP_HARMONY: "MP-HARMONY";
  QUICKAPP_WEBVIEW: "QUICKAPP-WEBVIEW";
  QUICKAPP_WEBVIEW_UNION: "QUICKAPP-WEBVIEW-UNION";
  QUICKAPP_WEBVIEW_HUAWEI: "QUICKAPP-WEBVIEW-HUAWEI";
  OTHER: "OTHER";
}

export declare const Platform: IPlatform;

export declare function getPlatform(): IPlatform[keyof IPlatform];

export declare const platform: ReturnType<typeof getPlatform>;

/** App */
export declare const isApp: boolean;
/** App Android */
export declare const isAppAndroid: boolean;
/** App iOS */
export declare const isAppIos: boolean;
/** App HarmonyOS Next */
export declare const isAppHarmony: boolean;
/** Web */
export declare const isWeb: boolean;
/** 小程序 */
export declare const isMp: boolean;
/** 微信小程序 */
export declare const isMpWeixin: boolean;
/** 支付宝小程序 */
export declare const isMpAlipay: boolean;
/** 百度小程序 */
export declare const isMpBaidu: boolean;
/** 头条小程序 */
export declare const isMpToutiao: boolean;
/** 飞书小程序 */
export declare const isMpLark: boolean;
/** QQ小程序 */
export declare const isMpQq: boolean;
/** 快手小程序 */
export declare const isMpKuaishou: boolean;
/** 京东小程序 */
export declare const isMpJd: boolean;
/** 360小程序 */
export declare const isMp360: boolean;
/** 小红书小程序 */
export declare const isMpXhs: boolean;
/** 鸿蒙元服务 */
export declare const isMpHarmony: boolean;
/** 快应用 */
export declare const isQuickappWebview: boolean;
/** 快应用联盟 */
export declare const isQuickappWebviewUnion: boolean;
/** 快应用华为 */
export declare const isQuickappWebviewHuawei: boolean;
/** 其他平台 */
export declare const isOtherPlatform: boolean;