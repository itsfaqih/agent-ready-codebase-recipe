import { globalStyle, style } from "@vanilla-extract/css";
import { vars } from "./theme.css";

globalStyle("html, body", { height: "100%", overflow: "hidden" });

export const frame = style({
  display: "grid",
  gridTemplateColumns: "560px minmax(0, 1fr)",
  height: "100%",
});

export const text = style({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  paddingLeft: 72,
  paddingRight: 8,
});

export const brand = style({ font: `500 16px ${vars.font.mono}`, letterSpacing: "0.02em", color: vars.color.muted });

export const title = style({
  fontSize: 70,
  lineHeight: 1.02,
  letterSpacing: "-0.035em",
  fontWeight: 700,
  margin: "20px 0 36px",
  textWrap: "balance",
});

export const command = style({
  background: vars.color.ink,
  color: vars.color.onInk,
  borderRadius: 12,
  padding: "15px 22px",
  font: `19px ${vars.font.mono}`,
});

export const demo = style({ position: "relative" });
