import { globalStyle } from "@vanilla-extract/css";
import { reducedMotion, vars } from "./theme.css";

globalStyle("*, *::before, *::after", { boxSizing: "border-box", margin: 0 });

globalStyle("body", {
  background: vars.color.bg,
  color: vars.color.ink,
  font: `16px/1.55 ${vars.font.sans}`,
  WebkitFontSmoothing: "antialiased",
});

globalStyle("a", { color: "inherit" });

globalStyle("*", {
  "@media": { [reducedMotion]: { transition: "none !important" } },
});
