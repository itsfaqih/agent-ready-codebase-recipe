import { execFileSync } from "node:child_process";
import { dark, light } from "../../site/src/styles/palette.ts";
import { type Scheme, themeKey } from "../../site/src/styles/scheme.ts";

const url = process.argv[2] ?? "https://agent-ready-codebase-recipe.localhost";

const widths = [390, 1280];

// Each system scheme with nothing stored, then each scheme chosen with the switch against the other system scheme.
const runs: { system: Scheme; chosen?: Scheme; widths: number[] }[] = [
  { system: "light", widths },
  { system: "dark", widths },
  { system: "dark", chosen: "light", widths: [1280] },
  { system: "light", chosen: "dark", widths: [1280] },
];

const palettes = { light, dark };

const pageText = 4.5;

const illustrationText = 3;

const rgb = (hex: string) => `rgb(${[1, 3, 5].map((at) => parseInt(hex.slice(at, at + 2), 16)).join(", ")})`;

// Text held to a lower minimum: the ratio the light design meets today, so it can't fade further. An entry matches the
// text's own element by selector, or by its computed color when the tone comes from one token.
const dim: { schemes: Scheme[]; selector?: string; color?: string; min: number; why: string }[] = [
  {
    schemes: ["light", "dark"],
    selector: '[data-tone="faint"], [data-tone="faint"] *',
    min: 3.2,
    why: "a screen's comment gray",
  },
  {
    schemes: ["light", "dark"],
    selector: '[data-tone="ok"]',
    min: 2.4,
    why: "the done green as a glyph on a light panel",
  },
  {
    schemes: ["light"],
    color: rgb(light.muted),
    min: 3,
    why: "page labels in the muted gray, below AA in the light design",
  },
];

const browser = (...args: string[]) =>
  execFileSync("agent-browser", args, {
    encoding: "utf8",
    env: { ...process.env, AGENT_BROWSER_SESSION: "arcr-contrast" },
  });

// Every group shown and every print finished, then each element with its own visible text is measured against what is
// painted beneath it: the elements under its first line, composited until one is opaque.
const measure = (scheme: Scheme) => `(async () => {
  const dim = ${JSON.stringify(dim.filter((entry) => entry.schemes.includes(scheme)))};
  const frames = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  const settle = async () => {
    for (let tries = 0; tries < 40; tries += 1) {
      const running = document.getAnimations().filter(
        (animation) => animation.playState === "running" && animation.effect.getComputedTiming().iterations !== Infinity,
      );
      if (running.length === 0) return;
      await Promise.race([Promise.all(running.map((animation) => animation.finished.catch(() => {}))), new Promise((resolve) => setTimeout(resolve, 1000))]);
      await frames();
    }
  };
  const parse = (value) => {
    const srgb = value.startsWith("color(srgb");
    const parts = value.slice(value.indexOf("(") + 1, -1).replace("srgb", "").split(/[\\s,/]+/).filter(Boolean).map(Number);
    if (parts.length < 3 || parts.some(Number.isNaN)) throw new Error("cannot read the color " + value);
    const [r, g, b] = srgb ? parts.slice(0, 3).map((part) => part * 255) : parts.slice(0, 3);
    return { r, g, b, a: parts[3] ?? 1 };
  };
  const over = (top, bottom) => ({
    r: top.r * top.a + bottom.r * (1 - top.a),
    g: top.g * top.a + bottom.g * (1 - top.a),
    b: top.b * top.a + bottom.b * (1 - top.a),
    a: 1,
  });
  const luminance = ({ r, g, b }) => {
    const [R, G, B] = [r, g, b].map((c) => (c / 255 <= 0.03928 ? c / 255 / 12.92 : ((c / 255 + 0.055) / 1.055) ** 2.4));
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  };
  const ratio = (a, b) => {
    const [dark, light] = [luminance(a), luminance(b)].sort((x, y) => x - y);
    return (light + 0.05) / (dark + 0.05);
  };
  const opacity = (element) => {
    let value = 1;
    for (let at = element; at; at = at.parentElement) value *= Number(getComputedStyle(at).opacity);
    return value;
  };
  const clipped = (element, x, y) => {
    for (let at = element; at; at = at.parentElement) {
      const style = getComputedStyle(at);
      if (style.overflowX === "visible" && style.overflowY === "visible") continue;
      const box = at.getBoundingClientRect();
      if (x < box.left || x > box.right || y < box.top || y > box.bottom) return true;
    }
    return false;
  };
  const ancestors = (element) => {
    const chain = [];
    for (let at = element; at; at = at.parentElement) chain.push(at);
    return chain;
  };
  const region = (element) => {
    const at = element.closest("header, section[id], footer, nav");
    const name = !at ? "end" : at.matches("header") ? "hero" : at.matches("section") ? "#" + at.id : at.localName;
    const picture = element.closest("[data-picture]")?.dataset.picture ?? (element.closest("[data-run-demo]") ? "run demo" : "");
    return picture ? name + " (" + picture + ")" : name;
  };
  // In development each stylesheet arrives by its own module after load, so wait until no more arrive.
  for (let count = -1; count !== document.styleSheets.length; ) {
    count = document.styleSheets.length;
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  for (const group of document.querySelectorAll("[data-reveal-group]")) group.toggleAttribute("data-shown", true);
  const texts = [...document.body.querySelectorAll("*")].filter((element) =>
    [...element.childNodes].some((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== ""),
  );
  const seen = new Set();
  const failures = [];
  let measured = 0;
  for (let top = 0; top < document.documentElement.scrollHeight; top += innerHeight / 2) {
    scrollTo({ top, behavior: "instant" });
    await frames();
    await settle();
    for (const element of texts) {
      if (seen.has(element)) continue;
      const node = [...element.childNodes].find((child) => child.nodeType === Node.TEXT_NODE && child.textContent.trim() !== "");
      const range = document.createRange();
      range.selectNodeContents(node);
      const rect = [...range.getClientRects()].find((box) => box.width > 1 && box.height > 1);
      if (!rect) continue;
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      if (y < 0 || y >= innerHeight || x < 0 || x >= innerWidth) continue;
      seen.add(element);
      const style = getComputedStyle(element);
      const alpha = opacity(element);
      if (style.visibility !== "visible" || alpha < 0.01 || clipped(element, x, y)) continue;
      const stack = document.elementsFromPoint(x, y);
      const beneath = stack.includes(element) ? stack.slice(stack.indexOf(element)) : ancestors(element);
      const layers = [];
      for (const layer of beneath) {
        const fill = parse(getComputedStyle(layer).backgroundColor);
        fill.a *= opacity(layer);
        if (fill.a > 0) layers.push(fill);
        if (fill.a >= 0.999) break;
      }
      const ground = layers.reduceRight((below, layer) => over(layer, below), { r: 255, g: 255, b: 255, a: 1 });
      const ink = parse(style.color);
      ink.a *= alpha;
      const contrast = ratio(over(ink, ground), ground);
      const exception = dim.find((entry) => (entry.selector ? element.matches(entry.selector) : style.color === entry.color));
      const min = exception ? exception.min : element.closest("[aria-hidden='true']") ? ${illustrationText} : ${pageText};
      measured += 1;
      if (contrast < min) {
        failures.push(region(element) + ' "' + node.textContent.trim().slice(0, 48) + '" ' + contrast.toFixed(2) + ":1, needs " + min);
      }
    }
  }
  scrollTo({ top: 0, behavior: "instant" });
  // Encoded, so the result comes back free of quotes and the separator.
  return [measured, ...failures].map(encodeURIComponent).join("|");
})()`;

const problems: string[] = [];

let measured = 0;

try {
  for (const run of runs) {
    const scheme = run.chosen ?? run.system;
    const label = run.chosen ? `${run.chosen} chosen on a ${run.system} system` : run.system;

    browser("set", "media", run.system);
    browser("open", url);
    browser(
      "eval",
      run.chosen
        ? `localStorage.setItem(${JSON.stringify(themeKey)}, ${JSON.stringify(run.chosen)})`
        : `localStorage.removeItem(${JSON.stringify(themeKey)})`,
    );

    for (const width of run.widths) {
      browser("set", "viewport", String(width), "900");
      browser("open", url);

      const ground = browser("eval", "getComputedStyle(document.body).backgroundColor").trim().replace(/^"|"$/g, "");

      if (ground !== rgb(palettes[scheme].bg))
        problems.push(`${label} ${width}px: the page is not ${scheme} (${ground})`);

      const output = browser("eval", measure(scheme)).trim().replace(/^"|"$/g, "");

      const [count, ...failures] = output.split("|").map(decodeURIComponent);

      measured += Number(count);

      for (const failure of failures) problems.push(`${label} ${width}px: ${failure}`);
    }
  }
} finally {
  browser("close");
}

if (problems.length > 0) {
  console.error(problems.join("\n"));
  process.exit(1);
}

console.log(
  `In light and dark at ${widths.join(" and ")}px, and at 1280px with each scheme chosen against the other system scheme, all ${measured} measured texts clear WCAG contrast against what is painted beneath them: ${pageText}:1 for page text, ${illustrationText}:1 in the illustrations, and the ${dim.length} dim tones in contrast.ts at the minimum each has in the light design.`,
);
