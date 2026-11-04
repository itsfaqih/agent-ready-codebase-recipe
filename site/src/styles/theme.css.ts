import { createGlobalTheme } from "@vanilla-extract/css";

export const vars = createGlobalTheme(":root", {
  color: {
    bg: "#fafafa",
    card: "#ffffff",
    line: "#e5e5e5",
    ink: "#171717",
    body: "#525252",
    muted: "#8f8f8f",
    subtle: "#f4f4f4",
    missing: "#a8a8a8",
    partial: "#f57c00",
    done: "#2dbe4e",
    onInk: "#ffffff",
    onInkMuted: "#a3a3a3",
    onInkLine: "#3a3a3a",
  },
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

export const breakpoint = {
  mobile: "screen and (max-width: 900px)",
  heroStacked: "screen and (max-width: 1159px)",
  heroCompact: "screen and (max-width: 535px)",
} as const;

export const reducedMotion = "(prefers-reduced-motion: reduce)";
