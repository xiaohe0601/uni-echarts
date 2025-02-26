import { onMounted, ref } from "vue";

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
  onMounted(async () => {
    if (data.value) {
      return;
    }

    const res = await fetch("https://oss.xiaohe.ink/sponsors/uni-echarts.json");

    data.value = await res.json();
  });

  return {
    data
  };
}