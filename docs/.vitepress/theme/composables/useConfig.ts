import { ref } from "vue";

interface Config {
  themeColor: string;
}

const data = ref<Config>();

export function useConfig() {
  async function boot() {
    if (data.value) {
      return;
    }

    const res = await fetch("https://oss.xiaohe.ink/configs/uni-echarts.json");

    data.value = await res.json();
  }

  void boot();

  return {
    data
  };
}