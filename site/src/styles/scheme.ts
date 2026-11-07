import type { StyleRule } from "@vanilla-extract/css";
import { dark, light } from "./palette.ts";

export type Scheme = "light" | "dark";

// The visitor's chosen scheme lives in localStorage under this key. With nothing stored, the page follows the system.
export const themeKey = "theme";

// The browser chrome color for each scheme.
export const chromeColor: Record<Scheme, string> = { light: light.bg, dark: dark.bg };

// The head script in Base.astro copies the stored choice to data-theme on <html>, and it wins over the system scheme.
export const systemDark = "(prefers-color-scheme: dark)";

export const chosenDark = ':root[data-theme="dark"]';

export const notChosenLight = ':root:not([data-theme="light"])';

// A style for an element while the dark scheme shows, whether the system or the visitor chose it.
export const whenDark = (rule: StyleRule): StyleRule => ({
  selectors: { [`${chosenDark} &`]: rule },
  "@media": { [systemDark]: { selectors: { [`${notChosenLight} &`]: rule } } },
});
