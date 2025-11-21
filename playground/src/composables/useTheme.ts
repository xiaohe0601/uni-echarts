export type Theme = "light" | "dark";

const theme = shallowRef<Theme>("light");

function toggle(value?: Theme) {
  if (value != null) {
    theme.value = value;
    return;
  }

  if (theme.value === "light") {
    theme.value = "dark";
  } else {
    theme.value = "light";
  }
}

export function useTheme() {
  return {
    theme,
    toggle
  };
}