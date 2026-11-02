import { style } from "@vanilla-extract/css";
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

export const nav = style({
  ...gutter,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  height: 64,
  borderBottom: `1px solid ${vars.color.line}`,
});

export const brand = style({ font: `500 13px ${vars.font.mono}`, letterSpacing: "0.02em" });

export const navLinks = style({ display: "flex", gap: 24, fontSize: 14, color: vars.color.body });

export const navLink = style({
  textDecoration: "none",
  transition: `color ${vars.motion.fast} ${vars.motion.ease}`,
  selectors: { "&:hover": { color: vars.color.ink } },
  "@media": { [breakpoint.mobile]: { selectors: { "&:not(:last-child)": { display: "none" } } } },
});

export const eyebrow = style({
  font: `400 12px ${vars.font.mono}`,
  letterSpacing: "0.14em",
  color: vars.color.muted,
  textTransform: "uppercase",
});

export const hero = style({
  ...gutter,
  display: "grid",
  gridTemplateColumns: "1fr 1.05fr",
  gap: 56,
  paddingTop: 88,
  paddingBottom: 96,
  borderBottom: `1px solid ${vars.color.line}`,
  alignItems: "center",
  "@media": {
    [breakpoint.mobile]: { ...gutterMobile, gridTemplateColumns: "1fr", paddingTop: 48, paddingBottom: 56, gap: 40 },
  },
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

export const lede = style({ fontSize: 18, color: vars.color.body, maxWidth: "30em" });

export const heroText = style({ containerType: "inline-size" });

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

export const problemCard = style({
  background: vars.color.card,
  border: `1px solid ${vars.color.line}`,
  borderRadius: 14,
  padding: 24,
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

export const step = style({
  padding: "24px 24px 0 0",
  selectors: {
    "& + &": { paddingLeft: 24, borderLeft: `1px solid ${vars.color.line}` },
  },
  "@media": {
    [breakpoint.mobile]: {
      selectors: {
        "&, & + &": { padding: "20px 0", borderLeft: 0, borderBottom: `1px solid ${vars.color.line}` },
      },
    },
  },
});

export const stepNumber = style({ font: `12px ${vars.font.mono}`, color: vars.color.muted });

export const stepTitle = style({ fontSize: 19, letterSpacing: "-0.02em", margin: "8px 0 6px" });

export const table = style({ width: "100%", borderCollapse: "collapse", marginTop: 36, fontSize: 15 });

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
  "@media": { [breakpoint.mobile]: { width: "auto" } },
});

export const tdWhen = style({
  color: vars.color.body,
  padding: "12px 0",
  borderBottom: `1px solid ${vars.color.line}`,
  verticalAlign: "top",
});

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
