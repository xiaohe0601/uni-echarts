import { onMounted, ref } from "vue";

interface SponsorItem {
  id: number;
  name: string;
  icon: string;
  description: string;
  link: string;
}

interface SponsorGroup {
  tier: string;
  items: SponsorItem[];
}

const data = ref<SponsorGroup[]>();

export function useSpecialSponsors() {
  async function boot() {
    if (data.value) {
      return;
    }

    const res = await fetch("https://oss.xiaohe.ink/sponsors/special/uni-echarts.json");

    data.value = await res.json();
  }

  onMounted(() => {
    void boot();
  });

  return {
    data
  };
}