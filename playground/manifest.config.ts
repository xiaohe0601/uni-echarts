import { defineManifestConfig } from "@uni-helper/vite-plugin-uni-manifest";

export default defineManifestConfig({
  name: "Uni ECharts",
  appid: "__UNI__D8AD38E",
  description: "",
  versionName: "1.0.0",
  versionCode: "10000",
  vueVersion: "3",
  h5: {
    router: {
      mode: "history",
      base: "/ui/"
    },
    optimization: {
      prefetch: true,
      preload: true,
      treeShaking: {
        enable: true
      }
    }
  },
  "app-plus": {
    compilerVersion: 3,
    nvueCompiler: "uni-app",
    nvueStyleCompiler: "uni-app",
    runmode: "liberate",
    optimization: {
      subPackages: true
    },
    distribute: {
      android: {
        permissions: [
          `<uses-permission android:name="android.permission.CHANGE_NETWORK_STATE"/>`,
          `<uses-permission android:name="android.permission.MOUNT_UNMOUNT_FILESYSTEMS"/>`,
          `<uses-permission android:name="android.permission.VIBRATE"/>`,
          `<uses-permission android:name="android.permission.READ_LOGS"/>`,
          `<uses-permission android:name="android.permission.ACCESS_WIFI_STATE"/>`,
          `<uses-feature android:name="android.hardware.camera.autofocus"/>`,
          `<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>`,
          `<uses-permission android:name="android.permission.CAMERA"/>`,
          `<uses-permission android:name="android.permission.GET_ACCOUNTS"/>`,
          `<uses-permission android:name="android.permission.READ_PHONE_STATE"/>`,
          `<uses-permission android:name="android.permission.CHANGE_WIFI_STATE"/>`,
          `<uses-permission android:name="android.permission.WAKE_LOCK"/>`,
          `<uses-permission android:name="android.permission.FLASHLIGHT"/>`,
          `<uses-feature android:name="android.hardware.camera"/>`,
          `<uses-permission android:name="android.permission.WRITE_SETTINGS"/>`
        ],
        abiFilters: [
          "armeabi-v7a",
          "arm64-v8a",
          "x86"
        ]
      },
      ios: {},
      sdkConfigs: {}
    },
    modules: {}
  },
  "app-harmony": {
    distribute: {
      bundleName: "ink.xiaohe.uni.echarts"
    }
  },
  "mp-weixin": {
    appid: "",
    setting: {
      urlCheck: false
    },
    optimization: {
      subPackages: true
    },
    mergeVirtualHostAttributes: true,
    lazyCodeLoading: "requiredComponents"
  }
});