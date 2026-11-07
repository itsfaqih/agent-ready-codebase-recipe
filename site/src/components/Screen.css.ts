import { globalStyle, keyframes, style } from "@vanilla-extract/css";
import { whenDark } from "../styles/scheme";
import { vars } from "../styles/theme.css";

// Faux product screens: the problem rows, the run steps and the docs figure draw their windows from these parts.

// The terminal's own inks, tuned for its near-black ground. The page's status colors mean the same thing here.
export const narrowest = "screen and (max-width: 359px)";

const term = {
  text: "#9d9da6",
  bright: "#f1f1f3",
  faint: "#6b6b73",
  ok: "#3ccf62",
  bad: "#ff6b6b",
  warn: "#ff9f43",
} as const;

// The window inside sits a gutter from the tile's top and left and runs off its right and bottom, as the hero's does.
// The tile takes the height of the taller screen in its row, and the shorter screen's window stretches to fill it.
export const tile = style({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  borderRadius: 14,
  background: vars.color.subtle,
  boxShadow: `inset 0 0 0 1px ${vars.color.line}`,
  userSelect: "none",
  WebkitFontSmoothing: "antialiased",
});

const overhang = 28;

const bleed = {
  position: "relative",
  flex: "1 0 auto",
  margin: `20px -${overhang}px -${overhang}px 20px`,
  paddingBottom: overhang + 16,
} as const;

// Terminal

// On dark, depth comes from surface steps, not shadow. A window that must stand apart from what it sits on (the black
// terminal on its tile, a dialog over a panel) takes this one brighter hairline in place of the light scheme's edges.
export const brightHairline = "0 0 0 1px rgba(255, 255, 255, 0.14)";

export const terminal = style([
  {
    ...bleed,
    display: "flex",
    flexDirection: "column",
    background: vars.color.terminal,
    borderRadius: 10,
    boxShadow: `inset 0 0 0 1px rgba(255, 255, 255, 0.07), 0 0 0 1px ${vars.color.edge}, 0 18px 36px -14px rgba(50, 50, 93, 0.3), 0 10px 20px -12px rgba(0, 0, 0, 0.3)`,
    color: term.text,
    font: `12px/1.65 ${vars.font.mono}`,
    fontVariantLigatures: "none",
    // On the narrowest phones the longest lines (35 characters) need the smaller size to stay inside the tile.
    "@media": { [narrowest]: { fontSize: 11 } },
  },
  whenDark({ boxShadow: brightHairline }),
]);

export const termBar = style({
  display: "flex",
  alignItems: "center",
  gap: 12,
  flex: "none",
  height: 30,
  padding: "0 12px",
  color: term.faint,
  fontSize: 11.5,
});

export const lights = style({ display: "flex", gap: 5 });

export const light = style({ width: 8, height: 8, borderRadius: "50%", background: "rgba(255, 255, 255, 0.16)" });

// The window runs 28px past the tile on the right, so content keeps its 14px inset from the visible edge.
const visibleRight = 14 + overhang;

export const termBody = style({ padding: `2px ${visibleRight}px 0 14px` });

export const line = style({ display: "block", whiteSpace: "pre" });

// A line too long for a narrow tile wraps at a space, as a narrow terminal wraps it.
export const wraps = style({ whiteSpace: "pre-wrap" });

// Astro collapses runs of spaces, so aligned columns and indents are fixed-width cells.
export const cell = style({ display: "inline-block", width: "var(--w)" });

globalStyle(`${terminal} [data-tone="bright"]`, { color: term.bright });

globalStyle(`${terminal} [data-tone="faint"]`, { color: term.faint });

globalStyle(`${terminal} [data-tone="ok"]`, { color: term.ok });

globalStyle(`${terminal} [data-tone="bad"]`, { color: term.bad });

globalStyle(`${terminal} [data-tone="warn"]`, { color: term.warn });

export const sigil = style({ color: term.faint, marginRight: "1ch" });

// Two short sessions stacked in one tile, one per agent.
export const split = style({
  display: "flex",
  flexDirection: "column",
  gap: 10,
  padding: `0 ${visibleRight}px 0 14px`,
});

export const pane = style({
  padding: "8px 0 2px",
  selectors: { "& + &": { borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: 10 } },
});

export const paneName = style({ color: term.faint, fontSize: 11.5 });

// Light panel: an agent session, a pull request or a browser

export const panel = style({
  ...bleed,
  display: "flex",
  flexDirection: "column",
  background: vars.color.card,
  borderRadius: 10,
  boxShadow: `0 0 0 1px ${vars.color.edge}, 0 18px 36px -16px rgba(50, 50, 93, 0.22), 0 6px 14px -8px rgba(0, 0, 0, 0.08)`,
  color: vars.color.ink,
  ...whenDark({ boxShadow: `0 0 0 1px ${vars.color.edge}` }),
  fontSize: 13,
  lineHeight: 1.45,
});

export const panelBar = style({
  display: "flex",
  alignItems: "center",
  gap: 8,
  flex: "none",
  height: 36,
  padding: `0 ${visibleRight}px 0 14px`,
  borderBottom: `1px solid ${vars.color.line}`,
  fontSize: 12.5,
  fontWeight: 600,
});

export const panelMeta = style({ marginLeft: "auto", fontWeight: 400, color: vars.color.muted });

export const panelBody = style({ display: "flex", flexDirection: "column", padding: `12px ${visibleRight}px 0 14px` });

globalStyle(`${panel} [data-tone="ok"]`, { color: vars.color.done });

globalStyle(`${panel} [data-tone="bad"]`, { color: vars.color.fail });

globalStyle(`${panel} [data-tone="warn"]`, { color: vars.color.partial });

globalStyle(`${panel} [data-tone="faint"]`, { color: vars.color.muted });

// An agent's tool calls: a mark, the action, then what it acted on, each in its own track.
export const step = style({
  display: "grid",
  gridTemplateColumns: "2ch 7ch minmax(0, 1fr)",
  columnGap: "1ch",
  font: `12px/1.75 ${vars.font.mono}`,
  whiteSpace: "pre",
  color: vars.color.body,
});

export const message = style({
  margin: "10px 0 12px",
  paddingLeft: 12,
  borderLeft: `2px solid ${vars.color.line}`,
  fontSize: 13.5,
  lineHeight: 1.45,
  textWrap: "pretty",
});

export const status = style({
  display: "inline-flex",
  alignItems: "center",
  alignSelf: "flex-start",
  gap: 6,
  height: 24,
  padding: "0 10px 0 8px",
  borderRadius: 12,
  background: vars.color.subtle,
  fontSize: 12,
  color: vars.color.body,
});

export const statusIcon = style({ flex: "none" });

// Pull request

export const comment = style({
  display: "flex",
  flexDirection: "column",
  gap: 2,
  padding: "9px 0",
  selectors: {
    "&:first-child": { paddingTop: 0 },
    "& + &": { borderTop: `1px solid ${vars.color.line}` },
  },
});

export const commentHead = style({
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontSize: 12,
  color: vars.color.muted,
});

export const avatar = style({
  display: "grid",
  placeItems: "center",
  flex: "none",
  width: 18,
  height: 18,
  borderRadius: "50%",
  background: "#3f6fd8",
  color: "#ffffff",
  fontSize: 10,
  fontWeight: 600,
});

export const fileRef = style({ font: `11.5px ${vars.font.mono}`, color: vars.color.body });

export const commentText = style({ paddingLeft: 26, fontSize: 13.5 });

export const checks = style({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "6px 12px",
  paddingBottom: 12,
  marginBottom: 12,
  borderBottom: `1px solid ${vars.color.line}`,
  font: `12px/1.6 ${vars.font.mono}`,
  color: vars.color.body,
});

export const check = style({ display: "flex", gap: "1ch", whiteSpace: "pre" });

// Browser

export const urlBar = style({ justifyContent: "center", fontWeight: 400 });

export const url = style({
  padding: "3px 14px",
  borderRadius: 8,
  background: vars.color.subtle,
  font: `11.5px ${vars.font.mono}`,
  color: vars.color.body,
});

export const pageHead = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 10,
});

export const pageTitle = style({ fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em" });

export const button = style({
  display: "inline-flex",
  alignItems: "center",
  height: 26,
  padding: "0 10px",
  borderRadius: 7,
  boxShadow: `inset 0 0 0 1px ${vars.color.line}`,
  fontSize: 12.5,
  fontWeight: 500,
  selectors: { "&[data-open]": { background: vars.color.subtle, boxShadow: `inset 0 0 0 1px ${vars.color.missing}` } },
});

export const listRow = style({
  display: "flex",
  alignItems: "center",
  gap: 12,
  height: 30,
  selectors: { "& + &": { borderTop: `1px solid ${vars.color.line}` } },
});

export const bar = style({ height: 6, borderRadius: 3, background: vars.color.filler });

export const dialog = style({
  position: "absolute",
  top: 74,
  right: visibleRight,
  width: 184,
  padding: 12,
  borderRadius: 10,
  background: vars.color.raised,
  boxShadow: `0 0 0 1px ${vars.color.edge}, 0 16px 32px -10px rgba(0, 0, 0, 0.22)`,
  ...whenDark({ boxShadow: `${brightHairline}, 0 16px 32px -10px rgba(0, 0, 0, 0.7)` }),
});

export const dialogTitle = style({ fontSize: 13, fontWeight: 600, marginBottom: 8 });

export const option = style({ display: "flex", alignItems: "center", gap: 8, height: 26, fontSize: 13 });

export const radio = style({
  flex: "none",
  width: 14,
  height: 14,
  borderRadius: "50%",
  boxShadow: `inset 0 0 0 1.5px ${vars.color.missing}`,
  selectors: { "&[data-on]": { boxShadow: `inset 0 0 0 4px ${vars.color.ink}` } },
});

export const primary = style({
  display: "grid",
  placeItems: "center",
  height: 28,
  marginTop: 8,
  borderRadius: 7,
  background: vars.color.ink,
  color: vars.color.onInk,
  fontSize: 12.5,
  fontWeight: 500,
});

// A production alert laid over the terminal's empty foot: the consequence of the green run above it.
export const roomForAlert = style({ paddingBottom: 64 });

export const alert = style({
  position: "absolute",
  right: 16,
  bottom: 16,
  zIndex: 1,
  padding: "9px 12px 10px",
  borderRadius: 10,
  background: vars.color.raised,
  boxShadow: `0 0 0 1px ${vars.color.edge}, 0 12px 28px -10px rgba(0, 0, 0, 0.3)`,
  ...whenDark({ boxShadow: `${brightHairline}, 0 16px 32px -10px rgba(0, 0, 0, 0.7)` }),
});

export const alertHead = style({
  display: "flex",
  alignItems: "center",
  gap: 6,
  fontSize: 11.5,
  color: vars.color.body,
});

export const alertDot = style({ width: 7, height: 7, borderRadius: "50%", background: vars.color.fail });

export const alertText = style({
  marginTop: 3,
  font: `12px ${vars.font.mono}`,
  color: vars.color.fail,
  whiteSpace: "pre",
});

// Printing: once a group is in view its screens print their lines in reading order; a problem row's after lines wait
// for its before lines. components/sections.ts numbers them, and a figure that fades in first sets a later --print-base.
const printIn = keyframes({ from: { opacity: 0, transform: "translateY(4px)" } });

const pending = "html[data-motion] [data-reveal-group]:not([data-shown])";

const shown = "html[data-motion] [data-shown]";

globalStyle(`${pending} [data-print]`, { opacity: 0 });

globalStyle(`${shown} [data-print]`, {
  animation: `${printIn} 420ms ${vars.motion.ease} calc(var(--print-base, 350ms) + var(--print-i, 0) * 85ms) backwards`,
});

globalStyle(`${shown} [data-side="after"] [data-print]`, {
  animationDelay: "calc(var(--print-base, 350ms) + 400ms + var(--print-i, 0) * 85ms)",
});
