import { globalStyle, keyframes, style } from "@vanilla-extract/css";
import { vars } from "../styles/theme.css";
import { narrowest, panel, panelBody, terminal, tile as screenTile } from "./Screen.css";

// Below this width the agent's window moves under AGENTS.md instead of overlapping its right edge.
const stacked = "screen and (max-width: 759px)";

const overhang = 28;

// The agent's window covers the right of AGENTS.md: this share of the tile plus a fixed width, then its overhang.
const agentShare = "30%";

const agentExtra = 84;

export const figure = style({ margin: "40px 0 0" });

// The doc's lines are read first, so the agent prints only once the tile has faded in.
export const tile = style([screenTile, { vars: { "--print-base": "700ms" } }]);

export const doc = style([
  panel,
  {
    "@media": { [stacked]: { marginBottom: 0, paddingBottom: 0 } },
  },
]);

export const docBody = style([
  panelBody,
  {
    // The doc's text keeps 20px clear of the agent's window. AGENTS.md is about as wide as the tile, so the share holds.
    paddingRight: `calc(${agentShare} + ${agentExtra + 20 + overhang}px)`,
    "@media": { [stacked]: { paddingRight: 14 + overhang, paddingBottom: 72 } },
  },
]);

// The agent's window runs off the tile's right and bottom edges, as every screen on the page does.
export const agent = style([
  terminal,
  {
    position: "absolute",
    zIndex: 1,
    top: 72,
    right: -overhang,
    bottom: -overhang,
    width: `calc(${agentShare} + ${agentExtra + overhang}px)`,
    margin: 0,
    "@media": {
      [stacked]: {
        position: "relative",
        top: "auto",
        right: "auto",
        bottom: "auto",
        width: "auto",
        margin: `-56px -${overhang}px -${overhang}px 36px`,
      },
      [narrowest]: { marginLeft: 12 },
    },
  },
]);

// Under the doc on narrow screens the agent's window comes after it in the tile, though it is first in the markup.
globalStyle(tile, { "@media": { [stacked]: { flexDirection: "column-reverse" } } });

export const filler = style({
  display: "block",
  height: 7,
  marginBottom: 9,
  borderRadius: 4,
  background: vars.color.filler,
});

export const docHeading = style({ margin: "16px 0 6px", fontSize: 13.5, fontWeight: 700 });

export const first = style({ marginTop: 4 });

const blink = keyframes({ "50%": { opacity: 0 } });

export const caret = style({
  display: "inline-block",
  width: "0.6em",
  height: "1.1em",
  verticalAlign: "-0.2em",
  background: "#9d9da6",
  animation: `${blink} 1.1s steps(1) infinite`,
  "@media": { "(prefers-reduced-motion: reduce)": { animation: "none" } },
});

export const docList = style({
  display: "flex",
  flexDirection: "column",
  gap: 6,
  margin: 0,
  padding: "0 0 0 16px",
  fontSize: 13.5,
  lineHeight: 1.5,
  color: vars.color.body,
  textWrap: "pretty",
});

export const docItem = style({
  position: "relative",
  selectors: {
    "&::marker": { color: vars.color.missing },
    "&[data-lit]::before": {
      content: '""',
      position: "absolute",
      zIndex: -1,
      // 2px short of the list's 6px gap, so two lit docs stay two bands.
      inset: "-2px -8px -2px -24px",
      // Square corners: the ink bar on the left edge reads as a bracket when the band is rounded.
      background: `color-mix(in srgb, ${vars.color.ink} 5%, ${vars.color.card})`,
      boxShadow: `inset 2px 0 0 ${vars.color.ink}`,
    },
  },
});

globalStyle(`${docItem} strong`, { color: vars.color.ink, fontWeight: 600 });

export const docFile = style({ font: `12px ${vars.font.mono}`, color: vars.color.ink, whiteSpace: "nowrap" });

// The doc list sits above its own lit bands, which sit behind its text.
globalStyle(docList, { isolation: "isolate" });

export const caption = style({
  marginTop: 14,
  maxWidth: "44em",
  fontSize: 14,
  color: vars.color.body,
  textWrap: "pretty",
});

// A doc's band lights a beat after the agent's line that opens it prints.
const light = keyframes({ from: { opacity: 0 } });

globalStyle(`html[data-motion] [data-reveal-group]:not([data-shown]) ${docItem}[data-lit]::before`, { opacity: 0 });

globalStyle(`html[data-motion] [data-shown] ${docItem}[data-lit]::before`, {
  animation: `${light} 360ms ${vars.motion.ease} calc(var(--print-base, 350ms) + var(--lit, 0) * 85ms + 260ms) backwards`,
});
