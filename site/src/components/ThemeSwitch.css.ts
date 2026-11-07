import { style } from "@vanilla-extract/css";
import { whenDark } from "../styles/scheme";
import { vars } from "../styles/theme.css";

// A 32px hit area around a 16px glyph; the negative margins put the glyph, not the box, on the gap and the gutter.
export const button = style({
  display: "inline-grid",
  placeItems: "center",
  flex: "none",
  width: 32,
  height: 32,
  margin: "0 -8px",
  padding: 0,
  border: 0,
  borderRadius: 6,
  background: "transparent",
  color: "inherit",
  cursor: "pointer",
  transition: `color ${vars.motion.fast} ${vars.motion.ease}`,
  selectors: {
    "&:hover": { color: vars.color.ink },
    "&:focus-visible": { outline: `2px solid ${vars.color.done}`, outlineOffset: 0 },
  },
});

const glyph = style({ gridArea: "1 / 1" });

// The glyph follows the scheme that shows, so it is right from the first paint, before the switch's script runs.
export const moon = style([glyph, whenDark({ display: "none" })]);

export const sun = style([glyph, { display: "none" }, whenDark({ display: "block" })]);
