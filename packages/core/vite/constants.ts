export const PLATFORM_API: ReadonlyMap<string, string> = new Map([
  ["mp-360", "qh"],
  ["mp-alipay", "my"],
  ["mp-baidu", "swan"],
  ["mp-jd", "jd"],
  ["mp-kuaishou", "ks"],
  ["mp-lark", "tt"],
  ["mp-qq", "qq"],
  ["mp-toutiao", "tt"],
  ["mp-weixin", "wx"],
  ["mp-xhs", "xhs"],
  ["quickapp-webview", "qa"]
]);

export const SUPPORTED_ECHARTS_ENV: ReadonlySet<string> = new Set([
  "web",
  "h5",
  "mp-weixin"
]);