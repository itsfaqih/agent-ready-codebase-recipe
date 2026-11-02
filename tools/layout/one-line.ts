import { execFileSync } from "node:child_process";
import { AREAS } from "../../site/src/data/content.ts";
import { runTimeline } from "../../site/src/data/run.ts";

const url = process.argv[2] ?? "https://agent-ready-codebase-recipe.localhost";

const widths = [320, 360, 390, 768, 900, 901, 1024, 1100, 1280, 1440];

const messages = [...new Set(runTimeline(AREAS).map((frame) => frame.message))];

const browser = (...args: string[]) =>
  execFileSync("agent-browser", args, {
    encoding: "utf8",
    env: { ...process.env, AGENT_BROWSER_SESSION: "arcr-layout" },
  });

const lineCount = (message: string) => `(() => {
  const line = document.querySelector("[data-status-line]");
  line.textContent = ${JSON.stringify(message)};
  const range = document.createRange();
  range.selectNodeContents(line);
  return new Set([...range.getClientRects()].map((rect) => Math.round(rect.top))).size;
})()`;

const installFit = `(() => {
  const line = document.querySelector("[data-install-line]");
  const text = line.querySelector("[data-install-text]");
  const button = line.querySelector("button").getBoundingClientRect();
  const range = document.createRange();
  range.selectNodeContents(text);
  const visible = [...range.getClientRects()].filter((rect) => rect.width > 1);
  const tops = new Set(visible.map((rect) => Math.round(rect.top)));
  const textMiddle = (visible[0].top + visible[0].bottom) / 2;
  const glyphRight = button.right - 5;
  const size = parseFloat(getComputedStyle(line).fontSize);
  if (tops.size !== 1) return "takes " + tops.size + " lines";
  if (text.getBoundingClientRect().right > button.left + 0.5) return "runs under its copy icon";
  if (text.scrollWidth > text.clientWidth + 1) {
    if (size > 9.5) return "clips its command at " + size + "px, above the smallest size";
    if (getComputedStyle(text).overflowX !== "auto") return "clips its command with no way to scroll";
    text.scrollLeft = text.scrollWidth;
    const reachedEnd = Math.max(...[...range.getClientRects()].map((rect) => rect.right)) <= text.getBoundingClientRect().right + 1;
    text.scrollLeft = 0;
    if (!reachedEnd) return "can't scroll to the end of its command";
  }
  if (textMiddle < button.top || textMiddle > button.bottom) return "has its copy icon on another row";
  if (glyphRight > line.getBoundingClientRect().right + 0.5) return "pushes its copy icon past the column";
  if (button.right > innerWidth) return "pushes its copy icon off screen";
  if (size < 9.5) return "is only " + size + "px";
  return "fits";
})()`;

const sidewaysScroll = `document.documentElement.scrollWidth - innerWidth`;

const loneLastWords = `(() => {
  const lonely = [];
  for (const title of document.querySelectorAll("[data-problem-title]")) {
    const words = title.firstChild.textContent.split(" ");
    let offset = 0;
    const tops = words.map((word) => {
      const range = document.createRange();
      range.setStart(title.firstChild, offset);
      range.setEnd(title.firstChild, offset + word.length);
      offset += word.length + 1;
      return Math.round(range.getBoundingClientRect().top);
    });
    const last = tops.at(-1);
    if (new Set(tops).size > 1 && tops.filter((top) => top === last).length === 1) lonely.push(words.at(-1));
  }
  return lonely.join(", ");
})()`;

const checkOpacity = `getComputedStyle(document.querySelector("[data-install-line] button svg:nth-of-type(2)")).opacity`;

const svgTextOverflow = `(() => {
  const margin = 8;
  const rects = [...document.querySelectorAll("rect")].map((rect) => rect.getBBox());
  const overflowing = [];
  for (const text of document.querySelectorAll("text")) {
    const box = text.getBBox();
    const holders = rects.filter(
      (rect) => box.x >= rect.x && box.y >= rect.y && box.x < rect.x + rect.width && box.y < rect.y + rect.height,
    );
    const holder = holders.sort((a, b) => a.width - b.width)[0];
    const edge = holder ? holder.x + holder.width : document.documentElement.viewBox.baseVal.width;
    if (box.x + box.width + margin > edge) overflowing.push(text.textContent.trim());
  }
  return overflowing.join(" | ");
})()`;

const svgAssets = ["banner.svg", "how-it-works.svg"];

const wrapped: string[] = [];

try {
  browser("open", url);

  for (const width of widths) {
    browser("set", "viewport", String(width), "900");

    for (const message of messages) {
      const lines = Number(browser("eval", lineCount(message)));

      if (lines !== 1) wrapped.push(`${width}px: "${message}" takes ${lines} lines`);
    }

    const install = browser("eval", installFit).trim().replaceAll('"', "");

    if (install !== "fits") wrapped.push(`${width}px: the install line ${install}`);

    const overflow = Number(browser("eval", sidewaysScroll));

    if (overflow > 0) wrapped.push(`${width}px: the page scrolls sideways by ${overflow}px`);

    const lonely = browser("eval", loneLastWords).trim().replaceAll('"', "");

    if (lonely !== "") wrapped.push(`${width}px: a card title ends on a lone word (${lonely})`);
  }

  browser("set", "viewport", "1280", "900");
  browser("click", "[data-install-line] button");
  browser("wait", "300");

  const shown = browser("eval", checkOpacity).trim().replaceAll('"', "");

  if (shown !== "1") wrapped.push(`after a click the copy icon's check has opacity ${shown}`);

  for (const asset of svgAssets) {
    browser("open", new URL(`../../assets/${asset}`, import.meta.url).href);

    const overflowing = browser("eval", svgTextOverflow).trim().replaceAll('"', "");

    if (overflowing !== "") wrapped.push(`${asset}: text runs past its box (${overflowing})`);
  }
} finally {
  browser("close");
}

if (wrapped.length > 0) {
  console.error(wrapped.join("\n"));
  process.exit(1);
}

console.log(
  `At ${widths.join(", ")}px, ${messages.length} status messages and the install line stay on one line, the page has no sideways scroll, and no card title ends on a lone word. The copy icon confirms a click, and text stays inside its box in ${svgAssets.join(" and ")}.`,
);
