import { style } from "@vanilla-extract/css";
import { breakpoint, vars } from "../styles/theme.css";

export const button = style({
  display: "inline-flex",
  alignItems: "center",
  gap: 14,
  marginTop: 32,
  background: vars.color.ink,
  color: vars.color.onInk,
  border: 0,
  borderRadius: 10,
  padding: "13px 16px 13px 20px",
  font: `15px ${vars.font.mono}`,
  cursor: "pointer",
  maxWidth: "100%",
  textAlign: "left",
  transition: `transform ${vars.motion.fast} ${vars.motion.ease}`,
  selectors: {
    "&:active": { transform: "scale(0.98)" },
    "&:focus-visible": { outline: `2px solid ${vars.color.done}`, outlineOffset: 3 },
  },
  "@media": { [breakpoint.mobile]: { fontSize: 13 } },
});

export const label = style({ overflowWrap: "anywhere" });

export const hint = style({
  flex: "none",
  fontSize: 11,
  color: vars.color.onInkMuted,
  borderLeft: `1px solid ${vars.color.onInkLine}`,
  paddingLeft: 12,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
});

export const iconButton = style({
  position: "relative",
  display: "inline-grid",
  placeItems: "center",
  flex: "none",
  width: 24,
  height: 24,
  // Puts the glyph's right edge on the column edge; the column sizes the text around the remaining 19px.
  marginRight: -5,
  padding: 0,
  border: 0,
  borderRadius: 6,
  background: "transparent",
  color: vars.color.muted,
  cursor: "pointer",
  transition: `color ${vars.motion.fast} ${vars.motion.ease}, background-color ${vars.motion.fast} ${vars.motion.ease}`,
  "::before": { content: '""', position: "absolute", inset: -6 },
  selectors: {
    "&:hover": { color: vars.color.ink, background: vars.color.subtle },
    "&[data-copied]": { color: vars.color.ink },
    "&:focus-visible": { outline: `2px solid ${vars.color.done}`, outlineOffset: 1 },
  },
});

const glyph = style({
  gridArea: "1 / 1",
  transition: `opacity ${vars.motion.fast} ${vars.motion.ease}`,
});

export const copyGlyph = style([glyph, { selectors: { "[data-copied] &": { opacity: 0 } } }]);

export const checkGlyph = style([glyph, { opacity: 0, selectors: { "[data-copied] &": { opacity: 1 } } }]);

export const iconHint = style({
  position: "absolute",
  width: 1,
  height: 1,
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
});
