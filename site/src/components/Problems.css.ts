import { style } from "@vanilla-extract/css";
import { breakpoint, vars } from "../styles/theme.css";

// Below this width a before and after tile side by side would be too narrow for their lines, so they stack.
const pairStacked = "screen and (max-width: 759px)";

export const rows = style({ marginTop: 56 });

export const row = style({
  display: "grid",
  gridTemplateColumns: "minmax(0, 0.78fr) minmax(0, 2fr)",
  columnGap: 40,
  rowGap: 24,
  padding: "40px 0",
  borderTop: `1px solid ${vars.color.line}`,
  selectors: { "&:last-child": { paddingBottom: 0 } },
  "@media": { [breakpoint.heroStacked]: { gridTemplateColumns: "minmax(0, 1fr)" } },
});

// Beside the pair, the copy starts level with the tiles, below their labels.
export const copy = style({
  maxWidth: "34em",
  paddingTop: 30,
  "@media": { [breakpoint.heroStacked]: { paddingTop: 0 } },
});

export const title = style({
  fontSize: 22,
  lineHeight: 1.2,
  letterSpacing: "-0.02em",
  fontWeight: 700,
  margin: "0 0 8px",
  textWrap: "balance",
});

export const body = style({ color: vars.color.body, fontSize: 15, textWrap: "pretty" });

// Each side's label, tile and caption share the row's three tracks, so the two tiles match in height and line up.
export const pair = style({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gridTemplateRows: "auto 1fr auto",
  columnGap: 16,
  "@media": { [pairStacked]: { gridTemplateColumns: "minmax(0, 1fr)", gridTemplateRows: "none", rowGap: 32 } },
});

export const side = style({
  display: "grid",
  gridRow: "span 3",
  gridTemplateRows: "subgrid",
  margin: 0,
  minWidth: 0,
  "@media": { [pairStacked]: { gridRow: "auto", gridTemplateRows: "auto auto auto" } },
});

export const label = style({
  display: "flex",
  alignItems: "center",
  gap: 8,
  height: 18,
  marginBottom: 12,
  font: `12px ${vars.font.mono}`,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: vars.color.muted,
  selectors: { [`${side}[data-side="after"] &`]: { color: vars.color.ink } },
});

export const caption = style({ marginTop: 12, fontSize: 14, color: vars.color.body, textWrap: "pretty" });
