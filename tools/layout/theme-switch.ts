import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { dark, light } from "../../site/src/styles/palette.ts";
import { themeKey } from "../../site/src/styles/scheme.ts";

const url = process.argv[2] ?? "https://agent-ready-codebase-recipe.localhost";

const rgb = (hex: string) => `rgb(${[1, 3, 5].map((at) => parseInt(hex.slice(at, at + 2), 16)).join(", ")})`;

const session = "arcr-theme-switch";

const work = mkdtempSync(join(tmpdir(), "theme-switch-"));

// Runs at document start on every load: it records the scheme of the first frame drawn with a body, before it paints.
const firstFrame = join(work, "first-frame.js");

writeFileSync(
  firstFrame,
  `(() => {
    const record = () => {
      if (!document.body) return requestAnimationFrame(record);
      window.firstFrame = (document.documentElement.dataset.theme ?? "none") + " " + getComputedStyle(document.body).backgroundColor;
    };
    requestAnimationFrame(record);
  })()`,
);

const browser = (...args: string[]) =>
  execFileSync("agent-browser", ["--session", session, ...args], { encoding: "utf8" })
    .trim()
    .replace(/^"|"$/g, "");

// The theme attribute, the body background, the pressed state, the stored choice and the browser chrome colors.
const state = `[
  document.documentElement.dataset.theme ?? "none",
  getComputedStyle(document.body).backgroundColor,
  "pressed " + document.querySelector("[data-theme-switch]").getAttribute("aria-pressed"),
  "stored " + localStorage.getItem(${JSON.stringify(themeKey)}),
  "chrome " + [...document.querySelectorAll('meta[name="theme-color"]')].map((meta) => meta.content).join(" "),
].join(", ")`;

// Records every color transition the page starts from now on; the switch must start none.
const watchEasing = `window.colorEasings = [];
addEventListener("transitionrun", (event) => {
  if (/color|fill|stroke|shadow/.test(event.propertyName)) colorEasings.push(event.target.localName + " " + event.propertyName);
}, true)`;

const waitForFirstFrame = () => {
  for (let tries = 0; tries < 50; tries += 1) {
    const frame = browser("eval", `window.firstFrame ?? ""`);

    if (frame !== "") return frame;
    execFileSync("sleep", ["0.1"]);
  }

  return "never drawn";
};

const problems: string[] = [];

const expect = (what: string, actual: string, expected: string) => {
  if (actual !== expected) problems.push(`${what}: got "${actual}", expected "${expected}"`);
};

try {
  browser("--init-script", firstFrame, "set", "viewport", "1280", "900");
  browser("set", "media", "light");
  browser("open", url);
  browser("eval", `localStorage.removeItem(${JSON.stringify(themeKey)})`);
  browser("open", url);

  expect("with a light system, the first frame", waitForFirstFrame(), `none ${rgb(light.bg)}`);
  expect(
    "with a light system and nothing stored",
    browser("eval", state),
    `none, ${rgb(light.bg)}, pressed false, stored null, chrome ${light.bg} ${dark.bg}`,
  );

  browser("focus", 'nav a[href^="http"]');
  browser("press", "Tab");
  expect("Tab from GitHub lands on", browser("eval", `document.activeElement.getAttribute("aria-label")`), "Dark mode");

  browser("eval", watchEasing);
  browser("press", "Enter");
  expect("color transitions started by Enter", browser("eval", `[...new Set(colorEasings)].join(" | ")`), "");
  expect(
    "after Enter",
    browser("eval", state),
    `dark, ${rgb(dark.bg)}, pressed true, stored dark, chrome ${dark.bg} ${dark.bg}`,
  );

  browser("press", "Space");
  expect(
    "after Space",
    browser("eval", state),
    `light, ${rgb(light.bg)}, pressed false, stored light, chrome ${light.bg} ${light.bg}`,
  );

  browser("click", "[data-theme-switch]");
  expect(
    "after a click",
    browser("eval", state),
    `dark, ${rgb(dark.bg)}, pressed true, stored dark, chrome ${dark.bg} ${dark.bg}`,
  );

  browser("open", url);
  expect("after a reload, the first frame", waitForFirstFrame(), `dark ${rgb(dark.bg)}`);
  expect(
    "after a reload",
    browser("eval", state),
    `dark, ${rgb(dark.bg)}, pressed true, stored dark, chrome ${dark.bg} ${dark.bg}`,
  );

  browser("set", "media", "dark");
  browser("eval", `localStorage.setItem(${JSON.stringify(themeKey)}, "light")`);
  browser("open", url);
  expect("with a dark system and light stored, the first frame", waitForFirstFrame(), `light ${rgb(light.bg)}`);
  expect(
    "with a dark system and light stored",
    browser("eval", state),
    `light, ${rgb(light.bg)}, pressed false, stored light, chrome ${light.bg} ${light.bg}`,
  );
} finally {
  browser("close");
  rmSync(work, { recursive: true, force: true });
}

if (problems.length > 0) {
  console.error(problems.join("\n"));
  process.exit(1);
}

console.log(
  "The theme switch is reached by Tab from GitHub and switches the scheme by Enter, Space and click, with no color easing. The choice survives a reload, where the first frame drawn is already in the chosen scheme, and a stored light choice holds over a dark system. The browser chrome color follows the choice.",
);
