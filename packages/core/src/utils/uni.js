/* eslint-disable no-undef */

import { isMpAlipay, isMpToutiao, isMpWeixin } from "./env";
import { defaultTo } from "./helpers";

export function getDeviceInfo() {
  if (uni.canIUse("getDeviceInfo") || uni.getDeviceInfo) {
    return uni.getDeviceInfo();
  } else {
    return uni.getSystemInfoSync();
  }
}

export function getWindowInfo() {
  if (uni.canIUse("getWindowInfo") || uni.getWindowInfo) {
    return uni.getWindowInfo();
  } else {
    return uni.getSystemInfoSync();
  }
}

export function getAppBaseInfo() {
  if (uni.canIUse("getAppBaseInfo") || uni.getAppBaseInfo) {
    return uni.getAppBaseInfo();
  } else {
    return uni.getSystemInfoSync();
  }
}

export function getVersion() {
  if (isMpAlipay) {
    return my.SDKVersion;
  }

  return getAppBaseInfo().SDKVersion;
}

export function compareVersion(v1, v2) {
  const s1 = v1.split(".");
  const s2 = v2.split(".");

  for (let i = 0; i < Math.max(s1.length, s2.length); i += 1) {
    const num1 = Number.parseInt(defaultTo(s1[i], "0"));
    const num2 = Number.parseInt(defaultTo(s2[i], "0"));

    if (num1 > num2) {
      return 1;
    } else if (num1 < num2) {
      return -1;
    }
  }

  return 0;
}

function gte(version) {
  return compareVersion(getVersion(), version) >= 0;
}

export function canIUseCanvas2d() {
  if (isMpWeixin) {
    if (getDeviceInfo().platform === "mac") {
      return false;
    }

    return gte("2.9.0");
  }

  if (isMpAlipay) {
    return gte("2.7.0");
  }

  if (isMpToutiao) {
    return gte("1.78.0");
  }

  return false;
}

export function querySelect(component, selector, fields) {
  return new Promise((resolve, reject) => {
    uni.createSelectorQuery()
      .in(component)
      .select(selector)
      .fields(fields, () => {})
      .exec(([node]) => {
        if (node) {
          resolve(node);
        } else {
          reject();
        }
      });
  });
}