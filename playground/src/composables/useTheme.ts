export type Theme = "light" | "dark";

const theme = ref<Theme>("light");

export function useTheme() {
  function toggle(value?: Theme) {
    if (!isEmpty(value)) {
      theme.value = value!;
      return;
    }

    if (theme.value === "light") {
      theme.value = "dark";
    } else {
      theme.value = "light";
    }
  }

  return {
    theme,
    toggle
  };
}