import { execFileSync } from "node:child_process";
import { AREAS } from "../../site/src/data/content.ts";
import { runTimeline } from "../../site/src/data/run.ts";

const url = process.argv[2] ?? "https://agent-ready-codebase-recipe.localhost";

const widths = [320, 360, 390, 535, 536, 768, 900, 901, 1024, 1159, 1160, 1280, 1440];

const messages = [...new Set(runTimeline(AREAS).map((frame) => frame.message))];

const browser = (...args: string[]) =>
  execFileSync("agent-browser", args, {
    encoding: "utf8",
    env: { ...process.env, AGENT_BROWSER_SESSION: "arcr-layout" },
  });

const demoFit = `(() => {
  const session = document.querySelector('[data-slot="live"] [data-session]');
  const card = document.querySelector("[data-files-card]");
  if (!session || !card) return "is not on the page";
  const hero = document.querySelector("header").getBoundingClientRect();
  const visibleRight = Math.min(hero.right, innerWidth);
  const cardBox = card.getBoundingClientRect();
  if (cardBox.right > visibleRight || cardBox.bottom > hero.bottom) return "has its files card cut off";
  const statusBox = session.querySelector("[data-status-line]").getBoundingClientRect();
  const windowBox = session.parentElement.getBoundingClientRect();
  const stageBox = session.closest(".ss-stage").getBoundingClientRect();
  if (statusBox.bottom > Math.min(windowBox.bottom, stageBox.bottom) + 0.5) return "pushes its status line out of the picture";
  if (statusBox.top < cardBox.bottom && cardBox.left - 4 < session.querySelector("[data-area]").getBoundingClientRect().left) return "has its files card on its status line";
  const promptBox = session.querySelector("[data-prompt]").getBoundingClientRect();
  if (promptBox.top < cardBox.bottom && promptBox.bottom > cardBox.top) return "has its files card on its command line";
  const widthOf = (host, text) => {
    const probe = document.createElement("span");
    probe.style.cssText = "position:absolute;visibility:hidden;white-space:nowrap";
    probe.textContent = text;
    host.append(probe);
    const width = probe.getBoundingClientRect().width;
    probe.remove();
    return width;
  };
  const middleLine = (box) => [box.top + box.height / 2 - 9, box.top + box.height / 2 + 9];
  const check = (host, texts) => {
    const box = host.getBoundingClientRect();
    const [top, bottom] = middleLine(box);
    for (const text of texts) {
      const right = box.left + widthOf(host, text);
      if (right > visibleRight) return '"' + text + '" runs off the visible window';
      if (top < cardBox.bottom && bottom > cardBox.top && right > cardBox.left - 4) return '"' + text + '" runs under the files card';
    }
    return "";
  };
  const areas = ${JSON.stringify(AREAS)};
  for (const area of areas) {
    const row = session.querySelector('[data-area="' + area.name + '"]');
    const [name, finding, written] = ["[data-area-name]", "[data-row-text]", "[data-row-written]"].map((part) => row.querySelector(part));
    const problem = check(name, [area.name]) || check(finding, [area.finding, area.evidence]) || check(written, ["+2"]);
    if (problem) return problem;
    const nameRight = name.getBoundingClientRect().left + widthOf(name, area.name);
    if (nameRight > finding.getBoundingClientRect().left) return '"' + area.name + '" runs into its evidence';
    for (const text of [area.finding, area.evidence]) {
      const textRight = finding.getBoundingClientRect().left + widthOf(finding, text);
      if (textRight > written.getBoundingClientRect().right - widthOf(written, innerWidth > 535 ? "missing" : "+2")) return '"' + text + '" runs into its last column';
    }
    if (written.getBoundingClientRect().right > visibleRight) return '"' + area.name + '" has its file count off the visible window';
  }
  for (const tab of session.querySelectorAll("[data-phase]")) {
    if (tab.getBoundingClientRect().right > visibleRight) return "has its " + tab.dataset.phase + " tab off the visible window";
  }
  const statusProblem = check(session.querySelector("[data-status-line]"), ${JSON.stringify(messages)});
  if (statusProblem) return statusProblem;
  for (const text of [...session.querySelectorAll("*"), ...card.querySelectorAll("*")]) {
    if (text.children.length > 0 || text.textContent.trim() === "") continue;
    const size = parseFloat(getComputedStyle(text).fontSize);
    if (size < 10) return '"' + text.textContent + '" is only ' + size + "px";
  }
  return "fits";
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

// The brand, the links that show and the theme switch share one row; the switch's glyph ends on the gutter, level with
// the links, inside a hit area of at least 32px.
const navFit = `(() => {
  const nav = document.querySelector("nav");
  const brand = nav.firstElementChild;
  const range = document.createRange();
  range.selectNodeContents(brand);
  const lines = new Set([...range.getClientRects()].filter((rect) => rect.width > 1).map((rect) => Math.round(rect.top))).size;
  if (lines !== 1) return "wraps the brand onto " + lines + " lines";
  const shown = [...nav.querySelectorAll("a, button")].filter((item) => getComputedStyle(item).display !== "none");
  const gap = shown[0].getBoundingClientRect().left - brand.getBoundingClientRect().right;
  if (gap < 12) return "leaves " + gap.toFixed(1) + "px between the brand and its links";
  const button = nav.querySelector("[data-theme-switch]");
  const hit = button.getBoundingClientRect();
  if (hit.width < 32 || hit.height < 32) return "gives the theme switch a " + hit.width + "x" + hit.height + " hit area";
  const glyph = [...button.querySelectorAll("svg")].find((svg) => getComputedStyle(svg).display !== "none").getBoundingClientRect();
  const gutter = nav.getBoundingClientRect().right - parseFloat(getComputedStyle(nav).paddingRight);
  if (Math.abs(glyph.right - gutter) > 0.5) return "ends the theme switch glyph " + (glyph.right - gutter).toFixed(1) + "px off the gutter";
  const link = shown.at(-2).getBoundingClientRect();
  const offset = (glyph.top + glyph.bottom) / 2 - (link.top + link.bottom) / 2;
  if (Math.abs(offset) > 1) return "sets the theme switch glyph " + offset.toFixed(1) + "px off the links' middle";
  return "fits";
})()`;

// Each screen runs off its tile on the right and bottom, so its words must end 8px inside what the tile shows.
// A window laid over another (data-overlay) must leave the words beneath it 8px clear.
const pictureFit = `(() => {
  const cut = [];
  for (const tile of document.querySelectorAll("[data-picture]")) {
    const box = tile.getBoundingClientRect();
    const overlays = [...tile.querySelectorAll("[data-overlay]")];
    const walker = document.createTreeWalker(tile, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (node.textContent.trim() === "") continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      const beneath = overlays.filter((overlay) => !overlay.contains(node)).map((overlay) => overlay.getBoundingClientRect());
      for (const rect of range.getClientRects()) {
        if (rect.right > box.right - 8 || rect.bottom > box.bottom - 8) {
          cut.push(tile.dataset.picture + ": " + node.textContent.trim());
          break;
        }
        const covered = beneath.some(
          (o) => rect.right > o.left - 8 && rect.left < o.right + 8 && rect.bottom > o.top - 8 && rect.top < o.bottom + 8,
        );
        if (covered) {
          cut.push(tile.dataset.picture + ": " + node.textContent.trim() + " under a window");
          break;
        }
      }
      const size = parseFloat(getComputedStyle(node.parentElement).fontSize);
      if (size < 10) cut.push(node.textContent.trim() + " at " + size + "px");
    }
  }
  return cut.join(" | ");
})()`;

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

const entering = `[...document.querySelectorAll("[data-reveal], [data-print]")]`;

const docsVisibleBeforeScroll = `(() => {
  const items = [...document.querySelectorAll("#docs [data-reveal]")];
  if (items.length === 0) return "has no elements that enter";
  return items.filter((item) => getComputedStyle(item).opacity !== "0").length + " of " + items.length + " visible";
})()`;

const unsettled = `${entering}
  .filter((item) => getComputedStyle(item).opacity !== "1" || getComputedStyle(item).transform !== "none")
  .map((item) => item.textContent.trim().slice(0, 40))
  .join(" | ")`;

const unsettledAfterScroll = `(async () => {
  const frames = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  for (let top = 0; top < document.documentElement.scrollHeight; top += innerHeight / 2) {
    scrollTo({ top, behavior: "instant" });
    await frames();
  }
  scrollTo({ top: 0, behavior: "instant" });
  await frames();
  await Promise.all(${entering}.flatMap((item) => item.getAnimations()).map((animation) => animation.finished));
  return ${unsettled};
})()`;

const svgAssets = ["banner.svg", "how-it-works.svg"];

const wrapped: string[] = [];

try {
  browser("open", url);

  const docsBefore = browser("eval", docsVisibleBeforeScroll).trim().replaceAll('"', "");

  if (!docsBefore.startsWith("0 of ")) wrapped.push(`before scrolling, the docs section ${docsBefore}`);

  for (const width of widths) {
    browser("set", "viewport", String(width), "900");
    browser("wait", "250");

    const entered = browser("eval", unsettledAfterScroll).trim().replaceAll('"', "");

    if (entered !== "") wrapped.push(`${width}px: after a scroll through, not fully entered: ${entered}`);

    const demo = browser("eval", demoFit).trim().replace(/^"|"$/g, "");

    if (demo !== "fits") wrapped.push(`${width}px: the run demo: ${demo}`);

    const install = browser("eval", installFit).trim().replaceAll('"', "");

    if (install !== "fits") wrapped.push(`${width}px: the install line ${install}`);

    const nav = browser("eval", navFit).trim().replaceAll('"', "");

    if (nav !== "fits") wrapped.push(`${width}px: the nav ${nav}`);

    const overflow = Number(browser("eval", sidewaysScroll));

    if (overflow > 0) wrapped.push(`${width}px: the page scrolls sideways by ${overflow}px`);

    const pictures = browser("eval", pictureFit).trim().replaceAll('"', "");

    if (pictures !== "") wrapped.push(`${width}px: a screen cuts or shrinks its text (${pictures})`);

    const lonely = browser("eval", loneLastWords).trim().replaceAll('"', "");

    if (lonely !== "") wrapped.push(`${width}px: a problem title ends on a lone word (${lonely})`);
  }

  browser("set", "viewport", "1280", "900");
  browser("click", "[data-install-line] button");
  browser("wait", "300");

  const shown = browser("eval", checkOpacity).trim().replaceAll('"', "");

  if (shown !== "1") wrapped.push(`after a click the copy icon's check has opacity ${shown}`);

  browser("set", "media", "light", "reduced-motion");
  browser("open", url);

  const unmoved = browser("eval", unsettled).trim().replaceAll('"', "");

  if (unmoved !== "") wrapped.push(`with reduced motion, hidden or moved on load: ${unmoved}`);

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
  `At ${widths.join(", ")}px, the run demo keeps its ${messages.length} status messages and every area's text visible, clear of its files card and at 10px or larger, the install line stays on one line, the nav keeps its brand, links and theme switch on one row with the switch's glyph on the gutter, the page has no sideways scroll, every screen's text ends inside its tile at 10px or larger and clear of any window laid over it, and no problem title ends on a lone word. Each section enters: the docs section starts hidden, and after a scroll through every element that enters is fully visible in place, as it is on load with reduced motion. The copy icon confirms a click, and text stays inside its box in ${svgAssets.join(" and ")}.`,
);
