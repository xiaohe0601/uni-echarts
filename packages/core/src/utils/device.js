import { isMpAlipay, isMpToutiao, isMpWeixin } from "./env";
import { getDeviceInfo } from "./uni";

export function getIsPc() {
  // #ifdef WEB
  if (!("ontouchstart" in window)) {
    return true;
  }
  // #endif

  if (isMpWeixin || isMpToutiao || isMpAlipay) {
    return /windows/i.test(getDeviceInfo().platform);
  }

  return false;
}