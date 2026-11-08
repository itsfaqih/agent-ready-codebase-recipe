import { style } from "@vanilla-extract/css";
import { breakpoint, vars } from "../styles/theme.css";

// Below this width a step's screen and its copy are too narrow side by side, so the copy goes under the screen.
const stepStacked = "screen and (max-width: 759px)";

// Three steps in a row, their screens sharing one track so they match in height. Narrower, each step is a row.
export const steps = style({
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gridTemplateRows: "auto auto",
  columnGap: 20,
  marginTop: 48,
  "@media": {
    [breakpoint.heroStacked]: { gridTemplateColumns: "minmax(0, 1fr)", gridTemplateRows: "none", rowGap: 48 },
  },
});

export const step = style({
  display: "grid",
  gridRow: "span 2",
  gridTemplateRows: "subgrid",
  rowGap: 20,
  minWidth: 0,
  "@media": {
    [breakpoint.heroStacked]: {
      gridRow: "auto",
      gridTemplateRows: "none",
      gridTemplateColumns: "minmax(0, 1.25fr) minmax(0, 1fr)",
      columnGap: 40,
      alignItems: "center",
    },
    [stepStacked]: { gridTemplateColumns: "minmax(0, 1fr)", rowGap: 20 },
  },
});

export const tile = style({ minWidth: 0 });

export const copy = style({ maxWidth: "30em" });

export const label = style({ font: `12px ${vars.font.mono}`, color: vars.color.muted, letterSpacing: "0.06em" });

export const title = style({
  fontSize: 19,
  lineHeight: 1.25,
  letterSpacing: "-0.02em",
  fontWeight: 700,
  margin: "8px 0 6px",
});

export const body = style({ color: vars.color.body, fontSize: 15, textWrap: "pretty" });

// Audit: the proposed depth per area, the reply that confirms it, then what the audit found.

export const kicker = style({
  marginBottom: 4,
  font: `11px ${vars.font.mono}`,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: vars.color.muted,
});

export const depthRow = style({
  display: "grid",
  gridTemplateColumns: "76px 48px minmax(0, 1fr)",
  alignItems: "center",
  columnGap: 10,
  height: 30,
  fontSize: 13,
  whiteSpace: "nowrap",
  selectors: { "& + &": { borderTop: `1px solid ${vars.color.line}` } },
});

export const depthName = style({ fontWeight: 500 });

export const pill = style({
  justifySelf: "start",
  padding: "1px 7px",
  borderRadius: 6,
  background: vars.color.subtle,
  boxShadow: `inset 0 0 0 1px ${vars.color.line}`,
  font: `11.5px ${vars.font.mono}`,
});

export const reason = style({ color: vars.color.muted, fontSize: 12.5 });

export const reply = style({
  display: "flex",
  alignItems: "center",
  alignSelf: "flex-start",
  gap: 8,
  margin: "8px 0 12px",
  padding: "6px 12px 6px 6px",
  borderRadius: 14,
  background: vars.color.subtle,
  fontSize: 13,
});

export const finding = style({
  display: "grid",
  gridTemplateColumns: "14px 8ch minmax(0, 1fr)",
  alignItems: "center",
  columnGap: 8,
  font: `12px/1.8 ${vars.font.mono}`,
  color: vars.color.body,
  whiteSpace: "pre",
});

export const findingName = style({ color: vars.color.ink });

// Fill the gaps: the tool question, answered, then the files the run wrote.

export const question = style({
  display: "flex",
  flexDirection: "column",
  marginBottom: 12,
  padding: "10px 12px 8px",
  borderRadius: 10,
  boxShadow: `inset 0 0 0 1px ${vars.color.line}`,
});

export const questionTitle = style({ marginBottom: 4, fontSize: 13, fontWeight: 600 });

export const tag = style({
  marginLeft: 2,
  padding: "1px 6px",
  borderRadius: 6,
  background: vars.color.subtle,
  font: `10.5px ${vars.font.mono}`,
  color: vars.color.body,
});

export const file = style({
  display: "grid",
  gridTemplateColumns: "1ch 13ch minmax(0, 1fr)",
  columnGap: "1ch",
  font: `12px/1.8 ${vars.font.mono}`,
  color: vars.color.body,
  whiteSpace: "pre",
});
