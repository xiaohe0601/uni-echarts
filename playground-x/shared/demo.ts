export const GLOBAL_OPTION: Record<string, any> = {
  textStyle: {
    fontFamily: "MiSans, Inter, \"Helvetica Neue\", Helvetica, \"PingFang SC\", \"Hiragino Sans GB\", \"Microsoft YaHei\", \"微软雅黑\", Arial, sans-serif"
  }
};

export const CHART_STYLE_75 = "height:600rpx;";
export const CHART_STYLE_60 = "height:480rpx;";
export const CHART_STYLE_80 = "height:640rpx;";

export function getWindowWidth(): number {
  const width = Number(uni.getWindowInfo().windowWidth);

  return width > 0 ? width : 375;
}

export function getLegacyHeight(remValue: number): number {
  return (getWindowWidth() / 750) * 32 * remValue;
}

export function getContentWidth(): number {
  return Math.max(240, getWindowWidth() - 32);
}