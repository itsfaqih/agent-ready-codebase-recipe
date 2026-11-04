import { globalStyle, keyframes, style } from "@vanilla-extract/css";
import { breakpoint, vars } from "./theme.css";

const gutterMobile = {
  paddingLeft: vars.space.gutterMobile,
  paddingRight: vars.space.gutterMobile,
} as const;

const gutter = {
  paddingLeft: vars.space.gutter,
  paddingRight: vars.space.gutter,
  "@media": { [breakpoint.mobile]: gutterMobile },
} as const;

export const frame = style({
  maxWidth: 1160,
  margin: "0 auto",
  minHeight: "100vh",
  borderLeft: `1px solid ${vars.color.line}`,
  borderRight: `1px solid ${vars.color.line}`,
  "@media": { [breakpoint.mobile]: { border: 0 } },
});

const navHeight = 64;

// Anchor jumps and focus scrolling stop below the sticky nav.
globalStyle("html", {
  scrollPaddingTop: navHeight,
  "@media": { "(prefers-reduced-motion: no-preference)": { scrollBehavior: "smooth" } },
});

export const nav = style({
  ...gutter,
  position: "sticky",
  top: 0,
  zIndex: 10,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  height: navHeight,
  borderBottom: `1px solid ${vars.color.line}`,
  background: `color-mix(in srgb, ${vars.color.bg} 86%, transparent)`,
  backdropFilter: "blur(10px)",
});

export const brand = style({ font: `500 13px ${vars.font.mono}`, letterSpacing: "0.02em" });

export const navLinks = style({ display: "flex", gap: 24, fontSize: 14, color: vars.color.body });

export const navLink = style({
  position: "relative",
  textDecoration: "none",
  transition: `color ${vars.motion.fast} ${vars.motion.ease}`,
  selectors: {
    "&:hover, &[aria-current]": { color: vars.color.ink },
    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      bottom: -4,
      height: 1,
      background: vars.color.ink,
      opacity: 0,
      transition: `opacity ${vars.motion.base} ${vars.motion.ease}`,
    },
    "&[aria-current]::after": { opacity: 1 },
  },
  "@media": { [breakpoint.mobile]: { selectors: { "&:not(:last-child)": { display: "none" } } } },
});

export const eyebrow = style({
  font: `400 12px ${vars.font.mono}`,
  letterSpacing: "0.14em",
  color: vars.color.muted,
  textTransform: "uppercase",
});

export const hero = style({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.2fr)",
  paddingLeft: vars.space.gutter,
  borderBottom: `1px solid ${vars.color.line}`,
  overflow: "hidden",
  "@media": {
    [breakpoint.heroStacked]: { gridTemplateColumns: "minmax(0, 1fr)", rowGap: 32 },
    [breakpoint.mobile]: { paddingLeft: vars.space.gutterMobile },
  },
});

// Stacked, the stage reaches the screen's left edge so nothing cuts its window's shadow; the window keeps the gutter.
export const heroDemo = style({
  position: "relative",
  minHeight: 592,
  "@media": {
    [breakpoint.heroStacked]: { marginLeft: `calc(-1 * ${vars.space.gutter})` },
    [breakpoint.mobile]: { marginLeft: `calc(-1 * ${vars.space.gutterMobile})` },
    [breakpoint.heroCompact]: { minHeight: 432, marginTop: -16 },
  },
});

export const visuallyHidden = style({
  position: "absolute",
  width: 1,
  height: 1,
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
});

export const h1 = style({
  fontSize: 52,
  lineHeight: 1.04,
  letterSpacing: "-0.035em",
  fontWeight: 700,
  margin: "18px 0 20px",
  textWrap: "balance",
  "@media": { [breakpoint.mobile]: { fontSize: 38 } },
});

export const lede = style({ fontSize: 18, color: vars.color.body, maxWidth: "30em", textWrap: "pretty" });

export const heroText = style({
  containerType: "inline-size",
  alignSelf: "center",
  paddingTop: 72,
  paddingRight: 24,
  paddingBottom: 72,
  "@media": {
    [breakpoint.heroStacked]: { paddingTop: 56, paddingBottom: 0, paddingRight: vars.space.gutter },
    [breakpoint.mobile]: { paddingTop: 48, paddingRight: vars.space.gutterMobile },
  },
});

// The monospace text is 39.7em with its label and 30.7em without. The copy icon and its gap take 21px of the column,
// so these sizes fill what remains. Below 9.5px it stops shrinking, and installText scrolls the end of the command.
export const install = style({
  display: "flex",
  alignItems: "center",
  gap: 2,
  marginTop: 14,
  fontFamily: vars.font.mono,
  fontSize: "clamp(9.5px, calc((100cqi - 21px) / 39.7), 13px)",
  whiteSpace: "nowrap",
  color: vars.color.muted,
  "@container": { "(max-width: 439px)": { fontSize: "clamp(9.5px, calc((100cqi - 21px) / 30.7), 13px)" } },
});

export const installText = style({ minWidth: 0, overflowX: "auto", overflowY: "hidden", scrollbarWidth: "none" });

export const installLabel = style({
  "@container": {
    "(max-width: 439px)": {
      position: "absolute",
      width: 1,
      height: 1,
      overflow: "hidden",
      clipPath: "inset(50%)",
      whiteSpace: "nowrap",
    },
  },
});

export const installCode = style({ color: vars.color.body, font: "inherit" });

export const section = style({
  ...gutter,
  paddingTop: 96,
  paddingBottom: 96,
  borderBottom: `1px solid ${vars.color.line}`,
  "@media": { [breakpoint.mobile]: { ...gutterMobile, paddingTop: 64, paddingBottom: 64 } },
});

export const h2 = style({
  fontSize: 36,
  lineHeight: 1.1,
  letterSpacing: "-0.03em",
  fontWeight: 700,
  margin: "14px 0",
  textWrap: "balance",
  maxWidth: "18em",
  "@media": { [breakpoint.mobile]: { fontSize: 30 } },
});

export const sub = style({ color: vars.color.body, fontSize: 17, maxWidth: "36em" });

export const problems = style({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 16,
  marginTop: 40,
  "@media": { [breakpoint.mobile]: { gridTemplateColumns: "1fr" } },
});

const lifted = {
  borderColor: vars.color.muted,
  transform: "translateY(-2px)",
  boxShadow: "0 10px 24px -12px rgba(50, 50, 93, 0.22), 0 2px 6px -3px rgba(0, 0, 0, 0.08)",
} as const;

export const problemCard = style({
  background: vars.color.card,
  border: `1px solid ${vars.color.line}`,
  borderRadius: 14,
  padding: 24,
  transition: `border-color ${vars.motion.fast} ${vars.motion.ease}, transform ${vars.motion.base} ${vars.motion.ease}, box-shadow ${vars.motion.base} ${vars.motion.ease}`,
  selectors: { "&:focus-within": lifted },
  "@media": { "(hover: hover)": { selectors: { "&:hover": lifted } } },
});

// One dash and its gap in the missing icon's stroke-dasharray, so each loop moves the dashes along by one.
const march = keyframes({ to: { strokeDashoffset: -6.6 } });

// stroke-dashoffset inherits into the icon's <use> copy. Paused, the dashes stop where they are when the pointer leaves.
export const problemIcon = style({
  "@media": {
    "(hover: hover) and (prefers-reduced-motion: no-preference)": {
      animation: `${march} 1.4s linear infinite paused`,
      selectors: { [`${problemCard}:hover &`]: { animationPlayState: "running" } },
    },
  },
});

export const cardTitle = style({ fontSize: 19, letterSpacing: "-0.02em", margin: "14px 0 6px", textWrap: "balance" });

export const cardBody = style({ color: vars.color.body, fontSize: 15 });

export const steps = style({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  marginTop: 40,
  borderTop: `1px solid ${vars.color.line}`,
  "@media": { [breakpoint.mobile]: { gridTemplateColumns: "1fr" } },
});

// Each step inks its stretch of the top rule once the steps are in, so the finished run stays drawn.
export const step = style({
  position: "relative",
  padding: "24px 24px 0 0",
  selectors: {
    "& + &": { paddingLeft: 24, borderLeft: `1px solid ${vars.color.line}` },
    "&::before": {
      content: '""',
      position: "absolute",
      top: -1,
      left: 0,
      right: 0,
      height: 1,
      background: vars.color.ink,
      transformOrigin: "left",
    },
    "& + &::before": { left: -1 },
  },
  "@media": {
    [breakpoint.mobile]: {
      selectors: {
        "&, & + &": { padding: "20px 0", borderLeft: 0, borderBottom: `1px solid ${vars.color.line}` },
        "&::before": { display: "none" },
      },
    },
  },
});

export const stepNumber = style({
  font: `12px ${vars.font.mono}`,
  color: vars.color.muted,
  transition: `color ${vars.motion.fast} ${vars.motion.ease}`,
  selectors: { [`${step}:hover &`]: { color: vars.color.ink } },
});

export const stepTitle = style({ fontSize: 19, letterSpacing: "-0.02em", margin: "8px 0 6px" });

// Separate borders belong to their cells, so a row's rule enters with its text instead of waiting there empty.
export const table = style({
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: 0,
  marginTop: 36,
  fontSize: 15,
});

export const th = style({
  textAlign: "left",
  font: `12px ${vars.font.mono}`,
  color: vars.color.muted,
  letterSpacing: "0.06em",
  padding: "0 0 10px",
  borderBottom: `1px solid ${vars.color.line}`,
  fontWeight: 400,
});

export const tdFile = style({
  font: `13.5px ${vars.font.mono}`,
  width: "34%",
  padding: "12px 16px 12px 0",
  borderBottom: `1px solid ${vars.color.line}`,
  verticalAlign: "top",
  transition: `background-color ${vars.motion.fast} ${vars.motion.ease}, box-shadow ${vars.motion.fast} ${vars.motion.ease}`,
  "@media": { [breakpoint.mobile]: { width: "auto" } },
});

export const tdWhen = style({
  color: vars.color.body,
  padding: "12px 0",
  borderBottom: `1px solid ${vars.color.line}`,
  verticalAlign: "top",
  transition: `background-color ${vars.motion.fast} ${vars.motion.ease}, box-shadow ${vars.motion.fast} ${vars.motion.ease}`,
});

export const docRow = style({});

// The highlight bleeds past the row's flush edges so its text does not touch the band.
globalStyle(`${docRow}:hover > td`, { background: vars.color.subtle });

globalStyle(`${docRow}:hover > td:first-child`, { boxShadow: `-12px 0 0 ${vars.color.subtle}` });

globalStyle(`${docRow}:hover > td:last-child`, { boxShadow: `12px 0 0 ${vars.color.subtle}` });

export const end = style({ ...gutter, textAlign: "center", paddingTop: 112, paddingBottom: 112 });

export const endTitle = style([h2, { margin: "0 auto 12px" }]);

export const endSub = style([sub, { margin: "0 auto" }]);

export const footer = style({
  ...gutter,
  display: "flex",
  justifyContent: "space-between",
  paddingTop: 24,
  paddingBottom: 24,
  font: `12px ${vars.font.mono}`,
  color: vars.color.muted,
});

export const footerLink = style({
  transition: `color ${vars.motion.fast} ${vars.motion.ease}`,
  selectors: { "&:hover": { color: vars.color.ink } },
});

// Section entrances, gated by the data-motion attribute that components/sections.ts sets on <html>.
const rise = keyframes({ from: { opacity: 0, transform: "translateY(12px)" } });

const fade = keyframes({ from: { opacity: 0 } });

const draw = keyframes({ from: { transform: "scaleX(0)" } });

const pending = "html[data-motion] [data-reveal-group]:not([data-shown])";

const shown = "html[data-motion] [data-shown]";

globalStyle(`${pending} [data-reveal]`, { opacity: 0 });

globalStyle(`${shown} [data-reveal], ${shown} tr[data-reveal] > *`, {
  animation: `${rise} 650ms ${vars.motion.ease} calc(var(--reveal-i, 0) * 70ms) backwards`,
});

// Some engines ignore a transform on a table row, so a row enters through its cells.
globalStyle(`${shown} tr[data-reveal]`, { animation: "none" });

globalStyle(`${shown} [data-reveal="fade"]`, { animationName: fade });

globalStyle(`${pending} ${step}::before`, { transform: "scaleX(0)" });

globalStyle(`${shown} ${step}::before`, { animation: `${draw} 520ms ${vars.motion.ease} 800ms backwards` });

globalStyle(`${shown} ${step}:nth-child(2)::before`, { animationDelay: "1150ms" });

globalStyle(`${shown} ${step}:nth-child(3)::before`, { animationDelay: "1500ms" });
