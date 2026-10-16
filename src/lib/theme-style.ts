import type { CSSProperties } from "react";
import type { ThemeSettings } from "@/lib/supabase/types";

type ResolvedTheme = {
  background: string;
  surface: string;
  accent: string;
  muted: string;
  foreground: string;
  detail: string;
  detailSecondary: string;
};

function rgb(hex: string) {
  const value = hex.slice(1, 7);
  return [0, 2, 4].map((offset) => Number.parseInt(value.slice(offset, offset + 2), 16));
}

function luminance(hex: string) {
  const [red, green, blue] = rgb(hex).map((channel) => {
    const value = channel / 255;
    return value <= 0.03928
      ? value / 12.92
      : ((value + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrast(first: string, second: string) {
  const firstLuminance = luminance(first);
  const secondLuminance = luminance(second);
  return (
    (Math.max(firstLuminance, secondLuminance) + 0.05) /
    (Math.min(firstLuminance, secondLuminance) + 0.05)
  );
}

function minimumContrast(color: string, backgrounds: string[]) {
  return Math.min(...backgrounds.map((background) => contrast(color, background)));
}

export function resolveTheme(theme: ThemeSettings): ResolvedTheme {
  const palette = [
    theme.black,
    theme.prussian_blue,
    theme.orange,
    theme.alabaster_grey,
    theme.white,
  ];
  const ordered = [...new Set(palette)].sort(
    (first, second) => luminance(first) - luminance(second),
  );
  const background = ordered[0] ?? theme.black;
  const surface = ordered[1] ?? background;
  const backgrounds = [background, surface];
  const foreground = [...ordered].sort(
    (first, second) =>
      minimumContrast(second, backgrounds) - minimumContrast(first, backgrounds),
  )[0] ?? theme.white;
  const accent =
    minimumContrast(theme.orange, backgrounds) >= 4.5
      ? theme.orange
      : foreground;
  const muted =
    minimumContrast(theme.alabaster_grey, backgrounds) >= 7
      ? theme.alabaster_grey
      : foreground;

  return {
    background,
    surface,
    accent,
    muted,
    foreground,
    detail: theme.orange,
    detailSecondary: theme.alabaster_grey,
  };
}

export function themeStyle(theme: ThemeSettings): CSSProperties {
  const resolved = resolveTheme(theme);

  return {
    "--black": resolved.background,
    "--prussian-blue": resolved.surface,
    "--orange": resolved.accent,
    "--alabaster-grey": resolved.muted,
    "--white": resolved.foreground,
    "--theme-detail": resolved.detail,
    "--theme-detail-secondary": resolved.detailSecondary,
    "--background": resolved.background,
    "--foreground": resolved.foreground,
  } as CSSProperties;
}
