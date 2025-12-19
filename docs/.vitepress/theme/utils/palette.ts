import Color from "color";

export function createPalette(value: string) {
  const color = new Color(value);

  const [h, s, l] = color.hsl().array();

  return {
    light: {
      color1: color.hex().toLowerCase(),
      color2: Color.hsl(h - 1.22, s - 9.6, l + 9.21).hex().toLowerCase(),
      color3: Color.hsl(h - 2.37, s - 12.18, l + 13.13).hex().toLowerCase(),
      soft: Color.hsl(h + 6.71, s + 17.18, l + 10.98).alpha(0.14).rgb().string()
    },
    dark: {
      color1: Color.hsl(h - 2.42, s - 1.79, l + 25.49).hex().toLowerCase(),
      color2: Color.hsl(h - 2.37, s - 12.18, l + 13.13).hex().toLowerCase(),
      color3: Color.hsl(h - 1.76, s - 14.29, l + 5.49).hex().toLowerCase(),
      soft: Color.hsl(h + 6.71, s + 17.18, l + 10.98).alpha(0.16).rgb().string()
    }
  };
}