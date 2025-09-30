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
  onMounted(async () => {
    if (data.value) {
      return;
    }

    const res = await fetch("https://oss.xiaohe.ink/friendly/uni-echarts.json");

    data.value = await res.json();
  });

  return {
    data
  };
}