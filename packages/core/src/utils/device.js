import { isMpAlipay, isMpToutiao, isMpWeixin } from "./env.js";
import { getDeviceInfo } from "./uni.js";

export function getIsPc() {
  // #ifdef WEB
  if (!("ontouchstart" in window)) {
    return true;
  }
  // #endif

  if (isMpWeixin || isMpToutiao || isMpAlipay) {
    return getDeviceInfo().platform.includes("windows");
  }

  return false;
}