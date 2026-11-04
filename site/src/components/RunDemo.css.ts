import { createVar, globalStyle, keyframes, style } from "@vanilla-extract/css";
import { breakpoint, vars } from "../styles/theme.css";

const rowHeight = createVar();

// Past this width of terminal the rows would spread apart, so the type steps up and the rows stop growing.
const roomy = "(min-width: 760px)";

export const stage = style({
  position: "absolute",
  inset: 0,
  isolation: "isolate",
  // The margin leaves the window's shadow whole on its open sides; the hero crops the window itself at its edges.
  overflow: "clip",
  overflowClipMargin: 80,
  fontFamily: vars.font.sans,
  fontSize: 16,
  lineHeight: "normal",
  WebkitFontSmoothing: "antialiased",
  userSelect: "none",
});

const textIn = keyframes({ from: { opacity: 0 } });

const textOut = keyframes({ to: { opacity: 0 } });

// One fade both ways, in the same place: the old text is nearly gone as the new arrives, so they never read as a smear.
// Aligned to the line's bottom, not its baseline: an empty outgoing text has no baseline and would lift the new one.
globalStyle(`${stage} [data-swap]`, {
  display: "inline-grid",
  justifyItems: "start",
  verticalAlign: "bottom",
  whiteSpace: "pre",
});

globalStyle(`${stage} [data-swap] > span`, { gridArea: "1 / 1" });

globalStyle(`${stage} [data-was]`, { animation: `${textOut} 110ms linear forwards` });

globalStyle(`${stage} [data-now]`, { animation: `${textIn} 140ms linear 120ms backwards` });

export const terminal = style({
  position: "absolute",
  left: 40,
  top: 40,
  right: -100,
  bottom: -40,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  background: vars.color.ink,
  borderRadius: 12,
  boxShadow:
    "inset 0 0 0 1px rgba(255, 255, 255, 0.07), 0 0 0 1px rgba(0, 0, 0, 0.06), 0 30px 60px -12px rgba(50, 50, 93, 0.25), 0 18px 36px -18px rgba(0, 0, 0, 0.3)",
  "@media": {
    [breakpoint.heroStacked]: { left: vars.space.gutter, top: 0 },
    [breakpoint.mobile]: { left: vars.space.gutterMobile },
    [breakpoint.heroCompact]: { right: -60, top: vars.space.gutterMobile, bottom: 44 },
  },
});

export const bar = style({
  position: "relative",
  display: "flex",
  flexShrink: 0,
  alignItems: "center",
  height: 38,
  padding: "0 14.5px",
});

export const lights = style({ display: "flex", flexShrink: 0, gap: 6 });

export const dot = style({ width: 9, height: 9, borderRadius: "50%", background: "rgba(255, 255, 255, 0.16)" });

export const viewport = style({
  position: "relative",
  flex: 1,
  minHeight: 0,
  overflow: "hidden",
  containerType: "inline-size",
});

// Two copies of the session take turns: the live one leaves upward as the other rises, and they swap roles out of view.
export const slot = style({
  position: "absolute",
  inset: 0,
  willChange: "transform",
  transition: `transform 620ms ${vars.motion.ease}`,
  selectors: {
    "&[data-slot='next']": { transform: "translateY(100%)", visibility: "hidden" },
    "&[data-leaving][data-slot='live']": { transform: "translateY(-100%)" },
    "&[data-leaving][data-slot='next']": { transform: "translateY(0)", visibility: "visible" },
  },
});

export const session = style({
  position: "absolute",
  inset: 0,
  vars: { [rowHeight]: "27px" },
  display: "flex",
  flexDirection: "column",
  padding: "4px 16px 0",
  overflow: "hidden",
  color: "#9d9da6",
  fontFamily: vars.font.mono,
  fontVariantLigatures: "none",
  fontSize: 12.5,
  lineHeight: 1.4,
  "@media": {
    [breakpoint.heroCompact]: {
      vars: { [rowHeight]: "20px" },
      fontSize: 11,
      paddingLeft: 14,
      paddingRight: 14,
    },
  },
  "@container": { [roomy]: { vars: { [rowHeight]: "29px" }, fontSize: 14 } },
});

export const prompt = style({ flex: "none", whiteSpace: "nowrap" });

export const promptPath = style({ color: "#a8a8a8" });

export const promptSigil = style({ margin: "0 7px", color: "#8f8f8f" });

export const promptCommand = style({ color: "#f1f1f3" });

export const phases = style({
  display: "flex",
  flex: "none",
  gap: 4,
  marginTop: 12,
  marginLeft: -6,
  "@media": { [breakpoint.heroCompact]: { marginTop: 4, gap: 0 } },
});

export const phase = style({
  display: "flex",
  gap: "1ch",
  padding: "2px 6px",
  borderRadius: 3,
  color: "#8f8f8f",
  whiteSpace: "nowrap",
  selectors: { "&[data-on]": { background: "#fafafa", color: vars.color.ink } },
});

export const phaseLabel = style({ "@media": { [breakpoint.heroCompact]: { display: "none" } } });

export const phaseShort = style({ display: "none", "@media": { [breakpoint.heroCompact]: { display: "inline" } } });

export const phaseProgress = style({ fontVariantNumeric: "tabular-nums" });

// The last columns stop short of the crop by the same room the card keeps from the stage's edge.
export const rows = style({
  position: "relative",
  flex: "none",
  marginTop: 10,
  paddingRight: 124,
  "@media": { [breakpoint.heroCompact]: { marginTop: 4, paddingRight: 62 } },
  "@container": { [roomy]: { maxWidth: 760 } },
});

export const activeRow = style({
  position: "absolute",
  left: -8,
  right: -16,
  top: 0,
  height: rowHeight,
  borderRadius: 5,
  background: "#2b2b2b",
  opacity: 0,
  transition: `transform 200ms ${vars.motion.ease}, opacity 200ms ${vars.motion.ease}`,
  selectors: { "&[data-on]": { opacity: 1 } },
});

export const row = style({
  position: "relative",
  display: "grid",
  gridTemplateColumns: "14px 14ch minmax(0, 1fr) 7ch",
  columnGap: 10,
  alignItems: "center",
  height: rowHeight,
  whiteSpace: "nowrap",
  transition: "opacity 120ms linear",
  // A row prints when the audit reaches it, so a fresh run starts from its command alone.
  selectors: { "&[data-state='unread']": { opacity: 0 } },
  "@media": { [breakpoint.heroCompact]: { gridTemplateColumns: "12px 13ch minmax(0, 1fr) 2ch", columnGap: 10 } },
});

export const marks = style({ display: "inline-grid", alignItems: "center", justifyItems: "start" });

// Every mark sits in the same cell. The old one is gone before the new one arrives, and the row's state picks which shows.
export const mark = style({
  gridArea: "1 / 1",
  opacity: 0,
  filter: "blur(2px)",
  willChange: "transform",
  transform: "translate3d(0, 4px, 0)",
  transition: "opacity 150ms ease, filter 150ms ease, transform 0s 150ms",
});

const markOn = {
  opacity: 1,
  filter: "none",
  transform: "translate3d(0, 0, 0)",
  transition:
    "opacity 250ms ease-out 70ms, filter 250ms ease-out 70ms, transform 300ms cubic-bezier(0.22, 1, 0.36, 1) 70ms",
};

export const markFaint = style({
  color: "#6b6b6b",
  selectors: { [`${row}[data-state='unread'] &`]: markOn, [`${row}[data-state='recheck'] &`]: markOn },
});

export const markMissing = style({ color: "#a8a8a8", selectors: { [`${row}[data-state='missing'] &`]: markOn } });

export const markPartial = style({ color: "#fb923c", selectors: { [`${row}[data-state='partial'] &`]: markOn } });

export const markDone = style({ color: "#4ade80", selectors: { [`${row}[data-state='done'] &`]: markOn } });

export const areaName = style({ color: "#f4f4f4" });

export const finding = style({ color: "#a8a8a8" });

export const written = style({
  justifySelf: "end",
  color: "#4ade80",
  fontVariantNumeric: "tabular-nums",
  selectors: {
    "&[data-idle]": { color: "#6b6b6b" },
    "&[data-word='missing']": { color: "#a8a8a8" },
    "&[data-word='partial']": { color: "#fb923c" },
  },
  "@media": { [breakpoint.heroCompact]: { selectors: { "&[data-word]": { visibility: "hidden" } } } },
});

globalStyle(`${written} [data-swap]`, { justifyItems: "end" });

export const status = style({
  flex: "none",
  display: "flex",
  alignItems: "center",
  height: 36,
  marginTop: 8,
  marginRight: -16,
  borderTop: "1px solid #333333",
  color: "#d4d4d4",
  whiteSpace: "nowrap",
  "@media": { [breakpoint.heroCompact]: { height: 26, marginTop: 4, marginRight: -14 } },
});

export const nextPrompt = style({
  flex: "none",
  opacity: 0,
  transition: "opacity 200ms linear 300ms",
  selectors: { "&[data-next-prompt='shown']": { opacity: 1 } },
  "@media": { [breakpoint.heroCompact]: { display: "none" } },
});

const caretBlink = keyframes({ "0%, 55%": { opacity: 1 }, "56%, 100%": { opacity: 0 } });

export const caret = style({
  display: "inline-block",
  width: "1ch",
  height: "1.1em",
  verticalAlign: "text-bottom",
  background: "#d4d4d4",
  "@media": { "(prefers-reduced-motion: no-preference)": { animation: `${caretBlink} 1.1s step-end infinite` } },
});

export const card = style({
  position: "absolute",
  bottom: 40,
  right: 40,
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) auto",
  alignItems: "center",
  columnGap: 14,
  width: 236,
  padding: "12px 16px",
  background: vars.color.card,
  border: `1px solid ${vars.color.line}`,
  borderRadius: 12,
  boxShadow:
    "0 0 0 1px rgba(0, 0, 0, 0.04), 0 14px 32px -8px rgba(50, 50, 93, 0.24), 0 4px 10px -4px rgba(0, 0, 0, 0.1)",
  color: vars.color.ink,
  "@media": {
    // On a phone the status line needs the row's whole width, so the card hangs from the window's bottom edge, below it.
    [breakpoint.heroCompact]: {
      right: vars.space.gutterMobile,
      bottom: vars.space.gutterMobile,
      width: 200,
      columnGap: 8,
      padding: "4px 10px",
      borderRadius: 10,
    },
  },
});

export const cardLabel = style({
  display: "block",
  fontSize: 12.5,
  lineHeight: 1.3,
  whiteSpace: "nowrap",
  "@media": { [breakpoint.heroCompact]: { fontSize: 11.5 } },
});

// Two digits from the start, so the count never gains a column; the leading zero stays faint until it means something.
export const cardCount = style({
  display: "inline-flex",
  alignItems: "baseline",
  fontVariantNumeric: "tabular-nums",
  whiteSpace: "nowrap",
  font: `700 38px/1.05 ${vars.font.sans}`,
  letterSpacing: "-0.03em",
  transition: "opacity 160ms linear",
  "@media": { [breakpoint.heroCompact]: { fontSize: 26 } },
});

// A new run wipes the count out of sight rather than rolling a finished 17 back down to nothing.
globalStyle(`${card}[data-leaving] ${cardCount}`, { opacity: 0 });

// The window's edges soften a touch, so a figure passing them is never sliced.
export const digit = style({
  display: "inline-block",
  height: "1em",
  overflow: "hidden",
  lineHeight: 1,
  verticalAlign: "baseline",
  maskImage: "linear-gradient(to bottom, transparent, #000 8%, #000 92%, transparent)",
  selectors: {
    "&[data-digit='tens']": { transition: "opacity 300ms linear" },
    [`${cardCount}[data-leading-zero] &[data-digit='tens']`]: { opacity: 0.22 },
  },
});

export const strip = style({
  display: "flex",
  flexDirection: "column",
  willChange: "transform",
  transition: "transform 420ms cubic-bezier(0.3, 0.75, 0.1, 1)",
  selectors: { [`${cardCount}[data-snap] &`]: { transition: "none" } },
});

// The total settles from the right, the way a counter does.
export const stripTens = style({ transitionDelay: "45ms" });

globalStyle(`${strip} > span`, { display: "block", height: "1em", lineHeight: 1, textAlign: "left" });

export const cardNote = style({
  display: "block",
  marginTop: 2,
  font: `400 11px/1.3 ${vars.font.mono}`,
  color: vars.color.muted,
  whiteSpace: "nowrap",
  "@media": { [breakpoint.heroCompact]: { marginTop: 0, fontSize: 10.5 } },
});
