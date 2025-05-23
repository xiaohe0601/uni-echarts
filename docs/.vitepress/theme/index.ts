import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import Layout from "./components/Layout.vue";
import "virtual:group-icons.css";
import "./style.css";

export default {
  extends: DefaultTheme,
  Layout
} satisfies Theme;