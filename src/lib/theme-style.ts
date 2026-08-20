import type { CSSProperties } from "react";
import type { ThemeSettings } from "@/lib/supabase/types";

export function themeStyle(theme: ThemeSettings): CSSProperties {
  return {
    "--black": theme.black,
    "--prussian-blue": theme.prussian_blue,
    "--orange": theme.orange,
    "--alabaster-grey": theme.alabaster_grey,
    "--white": theme.white,
    "--background": theme.black,
    "--foreground": theme.white,
  } as CSSProperties;
}
