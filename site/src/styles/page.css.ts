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

// At the narrowest widths the brand shrinks so it keeps a clear gap to GitHub and the theme switch on one row.
export const brand = style({
  font: `500 13px ${vars.font.mono}`,
  letterSpacing: "0.02em",
  "@media": { [breakpoint.navNarrow]: { fontSize: 12, letterSpacing: 0 } },
});

export const navLinks = style({
  display: "flex",
  alignItems: "center",
  gap: 24,
  fontSize: 14,
  color: vars.color.body,
  "@media": { [breakpoint.mobile]: { gap: 16 } },
});

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
  // On a phone the nav keeps GitHub and drops the links to sections of this page.
  "@media": { [breakpoint.mobile]: { selectors: { '&[href^="#"]': { display: "none" } } } },
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

const pending = "html[data-motion] [data-reveal-group]:not([data-shown])";

const shown = "html[data-motion] [data-shown]";

globalStyle(`${pending} [data-reveal]`, { opacity: 0 });

globalStyle(`${shown} [data-reveal]`, {
  animation: `${rise} 650ms ${vars.motion.ease} calc(var(--reveal-i, 0) * 70ms) backwards`,
});

globalStyle(`${shown} [data-reveal="fade"]`, { animationName: fade });
