// One color contract, two value sets. The page takes the dark set when the visitor chooses it, or when nothing is chosen
// and the visitor's system asks for it.
export const light = {
  bg: "#fafafa",
  card: "#ffffff",
  // A surface laid over a window: a dialog over a panel, an alert over a terminal.
  raised: "#ffffff",
  line: "#e5e5e5",
  // The hairline around a window, where its shadow can't show its edge.
  edge: "rgba(0, 0, 0, 0.07)",
  // Placeholder bars standing in for text on a faux screen.
  filler: "#e5e5e5",
  ink: "#171717",
  body: "#525252",
  muted: "#8f8f8f",
  subtle: "#f4f4f4",
  missing: "#a8a8a8",
  partial: "#f57c00",
  done: "#2dbe4e",
  fail: "#d93036",
  // A terminal is the darkest thing on screen in both schemes: near-black in light, black in dark. Its own inks in
  // Screen.css.ts and RunDemo.css.ts rely on it.
  terminal: "#171717",
  // A filled control: the ink color as its ground.
  onInk: "#ffffff",
  onInkMuted: "#a3a3a3",
  onInkLine: "#3a3a3a",
};

export const dark: typeof light = {
  bg: "#0a0a0a",
  card: "#222222",
  raised: "#2a2a2a",
  line: "#2e2e2e",
  edge: "rgba(255, 255, 255, 0.08)",
  filler: "#333333",
  ink: "#ededed",
  body: "#a1a1a1",
  muted: "#8f8f8f",
  subtle: "#161616",
  missing: "#a8a8a8",
  partial: "#f57c00",
  done: "#2dbe4e",
  fail: "#ff5f5f",
  terminal: "#000000",
  onInk: "#0a0a0a",
  onInkMuted: "#666666",
  onInkLine: "#c4c4c4",
};
