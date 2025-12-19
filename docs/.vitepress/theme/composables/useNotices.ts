import { onMounted, ref } from "vue";

interface NoticeItem {
  id: number;
  text: string;
  button?: string;
  link?: string;
  dismiss?: string;
}

const data = ref<NoticeItem[]>();

export function useNotices() {
  onMounted(async () => {
    if (data.value) {
      return;
    }

    const res = await fetch("https://oss.xiaohe.ink/notices/uni-echarts.json");

    data.value = await res.json();
  });

  return {
    data
  };
}