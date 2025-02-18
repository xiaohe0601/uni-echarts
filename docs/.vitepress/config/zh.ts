import type { DefaultTheme } from "vitepress";
import { defineConfig } from "vitepress";

export const zh = defineConfig({
  lang: "zh-Hans",
  title: "Uni ECharts",
  description: "🪀 适用于uni-app的Apache ECharts组件",
  themeConfig: {
    nav: nav(),
    sidebar: sidebar(),
    footer: {
      message: "基于 MIT 许可发布",
      copyright: "版权所有 (c) 2025-PRESENT xiaohe0601"
    },
    docFooter: {
      prev: "上一页",
      next: "下一页"
    },
    outline: {
      label: "页面导航"
    },
    lastUpdated: {
      text: "最后更新于",
      formatOptions: {
        dateStyle: "short",
        timeStyle: "medium"
      }
    },
    darkModeSwitchLabel: "主题",
    lightModeSwitchTitle: "切换到浅色模式",
    darkModeSwitchTitle: "切换到深色模式",
    sidebarMenuLabel: "菜单",
    returnToTopLabel: "回到顶部",
    langMenuLabel: "多语言"
  }
});

function nav(): DefaultTheme.NavItem[] {
  return [
    { text: "指南", link: "/guide/introduction", activeMatch: "/guide/" },
    { text: "API 参考", link: "/apis/component", activeMatch: "/apis/" },
    { text: "示例", link: "/examples/basic", activeMatch: "/examples/" },
    { text: "支持我们", link: "/sponsor" }
  ];
}

function sidebar(): DefaultTheme.Sidebar {
  return {
    "/guide/": sidebarGuide(),
    "/apis/": sidebarApis(),
    "/examples/": sidebarExamples()
  };
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      base: "/guide",
      items: [
        { text: "介绍", link: "/introduction" },
        { text: "快速开始", link: "/getting-started" },
        { text: "关于 ECharts", link: "/echarts" },
        { text: "依赖注入", link: "/provide" },
        { text: "常见问题", link: "/faq" },
        { text: "更新日志", link: "/changelog" }
      ]
    }
  ];
}

function sidebarApis(): DefaultTheme.SidebarItem[] {
  return [
    {
      base: "/apis",
      items: [
        { text: "组件", link: "/component" },
        { text: "函数", link: "/function" }
      ]
    }
  ];
}

function sidebarExamples(): DefaultTheme.SidebarItem[] {
  return [
    {
      base: "/examples",
      items: [
        { text: "基础用法", link: "/basic" },
        { text: "异步数据", link: "/async-data" },
        { text: "动作调度", link: "/action-dispatch" },
        { text: "内置主题", link: "/builtin-theme" },
        { text: "颜色渐变", link: "/gradient" },
        { text: "GeoJSON", link: "/geo-json" },
        { text: "Pinia 集成", link: "/pinia-integration" },
        { text: "图表联动", link: "/connectable" },
        { text: "地球仪", link: "/globe" },
        { text: "手动更新", link: "/manual-update" },
        { text: "自定义 Tooltip", link: "/custom-tooltip" },
        { text: "导出图片", link: "/export-image" }
      ]
    }
  ];
}

export const search: DefaultTheme.LocalSearchOptions["locales"] = {
  root: {
    translations: {
      button: {
        buttonText: "搜索"
      },
      modal: {
        displayDetails: "显示详细列表",
        resetButtonTitle: "清除查询条件",
        noResultsText: "未找到相关结果",
        footer: {
          selectText: "选择",
          navigateText: "切换",
          closeText: "关闭"
        }
      }
    }
  }
};