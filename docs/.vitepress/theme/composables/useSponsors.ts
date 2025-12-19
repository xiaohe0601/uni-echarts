import { ref } from "vue";

interface SponsorItem {
  id: number;
  name: string;
  url?: string;
  amount: string;
  message?: string;
  date: string;
}

const data = ref<SponsorItem[]>();

export function useSponsors() {
  async function boot() {
    if (data.value) {
      return;
    }

    const res = await fetch("https://oss.xiaohe.ink/sponsors/uni-echarts.json");

    data.value = await res.json();
  }

  void boot();

  return {
    data
  };
}