import { onMounted, ref } from "vue";

interface FriendlyItem {
  id: string;
  icon: string;
  title: string;
  details: string;
  link: string;
}

const data = ref<FriendlyItem[]>();

export function useFriendly() {
  async function boot() {
    if (data.value) {
      return;
    }

    const res = await fetch("https://oss.xiaohe.ink/friendly/uni-echarts.json");

    data.value = await res.json();
  }

  onMounted(() => {
    void boot();
  });

  return {
    data
  };
}