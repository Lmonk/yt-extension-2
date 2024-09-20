import { Color, ColorArray } from "@/models";

function getLuminance([r, g, b]: Color): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function adjustBrightness([r, g, b]: Color, factor: number): Color {
  const adjust = (value: number) => Math.min(255, Math.max(0, value * factor));
  return [adjust(r), adjust(g), adjust(b)];
}

export function sortColors(palette: Color[]): Color[] {
  const sortedPalette = palette.sort(
    (a, b) => getLuminance(a) - getLuminance(b)
  );
  sortedPalette.shift();
  sortedPalette.pop();

  return sortedPalette;
}

export function getTextAndBackgroundColors(textColors: Color[]): {
  textColor: Color;
  backgroundColor: Color;
} {
  if (!textColors) {
    return { textColor: ColorArray.WHITE, backgroundColor: ColorArray.BLACK };
  }
  const sortedColors = sortColors(textColors);
  const dominantColor = sortedColors[sortedColors.length - 1];
  const luminance = getLuminance(dominantColor);
  const isDark = luminance < 128; // Якщо яскравість менше 128, вважаємо колір темним
  const isVeryDark = luminance < 64;
  const backgroundColor = dominantColor;
  let textColor = adjustBrightness(dominantColor, 0.6); // Темніший текст

  if (isVeryDark) {
    textColor = adjustBrightness(dominantColor, 2); // Світліший текст
  } else if (isDark) {
    textColor = adjustBrightness(dominantColor, 1.4); // Світліший текст
  }

  return { textColor, backgroundColor };
}
