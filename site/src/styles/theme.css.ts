import { assignVars, createGlobalTheme, globalStyle } from "@vanilla-extract/css";
import { dark, light } from "./palette";
import { chosenDark, notChosenLight, systemDark } from "./scheme";

export const vars = createGlobalTheme(":root", {
  color: light,
  font: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Inter, Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
  },
  motion: {
    fast: "150ms",
    base: "340ms",
    ease: "cubic-bezier(0.16, 1, 0.3, 1)",
  },
  space: {
    gutter: "48px",
    gutterMobile: "16px",
  },
});

const darkVars = assignVars(vars.color, dark);

globalStyle(":root", { colorScheme: "light dark" });

globalStyle(chosenDark, { colorScheme: "dark", vars: darkVars });

globalStyle(':root[data-theme="light"]', { colorScheme: "light" });

globalStyle(notChosenLight, { "@media": { [systemDark]: { vars: darkVars } } });

// Set for the frame in which the scheme switches, so every color changes at once instead of each easing on its own.
globalStyle(
  ":root[data-theme-switching] *, :root[data-theme-switching] *::before, :root[data-theme-switching] *::after",
  {
    transition: "none !important",
  },
);

export const breakpoint = {
  mobile: "screen and (max-width: 900px)",
  heroStacked: "screen and (max-width: 1159px)",
  heroCompact: "screen and (max-width: 535px)",
  navNarrow: "screen and (max-width: 359px)",
} as const;

export const reducedMotion = "(prefers-reduced-motion: reduce)";
