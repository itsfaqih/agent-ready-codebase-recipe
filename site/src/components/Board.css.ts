import { style, styleVariants } from "@vanilla-extract/css";
import { breakpoint, vars } from "../styles/theme.css";

export const board = style({
  background: vars.color.card,
  border: `1px solid ${vars.color.line}`,
  borderRadius: 16,
  padding: 20,
});

export const tabs = style({ display: "flex", gap: 6, marginBottom: 16, listStyle: "none", padding: 0 });

export const tab = style({
  flex: 1,
  font: `12px ${vars.font.mono}`,
  color: vars.color.muted,
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid transparent",
  whiteSpace: "nowrap",
  "@media": { [breakpoint.mobile]: { padding: "8px 6px", fontSize: 11, textAlign: "center" } },
  transition: `color ${vars.motion.base} ${vars.motion.ease}, background ${vars.motion.base} ${vars.motion.ease}`,
  selectors: {
    "&[aria-current='step']": {
      color: vars.color.ink,
      background: vars.color.subtle,
      borderColor: vars.color.line,
    },
  },
});

export const tabNumber = style({
  fontWeight: 500,
  marginRight: 6,
  "@media": { [breakpoint.mobile]: { display: "none" } },
});

export const grid = style({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 8,
  listStyle: "none",
  padding: 0,
  "@media": {
    [breakpoint.mobile]: { gridTemplateColumns: "repeat(2, 1fr)" },
    "screen and (max-width: 359px)": { gridTemplateColumns: "1fr" },
  },
});

export const tile = style({
  display: "flex",
  gap: 10,
  alignItems: "flex-start",
  padding: 12,
  border: `1px solid ${vars.color.line}`,
  borderRadius: 10,
  minHeight: 68,
});

export const chip = style({ position: "relative", width: 22, height: 22, flex: "none", marginTop: 1 });

const iconBase = style({
  position: "absolute",
  inset: 0,
  opacity: 0,
  transition: `opacity ${vars.motion.base} ${vars.motion.ease}`,
});

export const icon = styleVariants({ missing: "missing", partial: "partial", done: "done" }, (status) => [
  iconBase,
  { selectors: { [`${tile}[data-status='${status}'] &`]: { opacity: 1 } } },
]);

export const name = style({ display: "block", fontSize: 14, lineHeight: 1.2, letterSpacing: "-0.01em" });

export const summary = style({
  display: "block",
  fontSize: 12,
  color: vars.color.muted,
  lineHeight: 1.3,
  marginTop: 3,
});

export const foot = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  marginTop: 14,
  font: `12px ${vars.font.mono}`,
  color: vars.color.muted,
  "@media": { "screen and (max-width: 1100px)": { flexDirection: "column", alignItems: "flex-start", gap: 8 } },
});

export const status = style({
  transition: `color ${vars.motion.base} ${vars.motion.ease}`,
  selectors: { "&[data-final]": { color: vars.color.done } },
});

export const legend = style({ display: "flex", gap: 14, flex: "none" });

export const legendIcon = style({ verticalAlign: -2, marginRight: 5 });
