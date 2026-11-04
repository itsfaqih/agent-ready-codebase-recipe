import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";
import config from "../../../astro.config.mjs";
import Page from "../pages/index.astro";
import { markCurrentSection, revealSections } from "./sections";

const watchers = new Map<Element, FakeIntersectionObserver[]>();

class FakeIntersectionObserver {
  constructor(private readonly callback: (entries: { target: Element; isIntersecting: boolean }[]) => void) {}

  observe(target: Element) {
    watchers.set(target, [...(watchers.get(target) ?? []), this]);
  }

  unobserve(target: Element) {
    watchers.set(
      target,
      (watchers.get(target) ?? []).filter((watcher) => watcher !== this),
    );
  }

  report(target: Element, isIntersecting: boolean) {
    this.callback([{ target, isIntersecting }]);
  }
}

const section = (selector: string) => {
  const element = document.querySelector(selector);

  if (!element) throw new Error(`no ${selector} on the page`);

  return element;
};

const scroll = (selector: string, inView: boolean) => {
  const target = section(selector);

  for (const watcher of watchers.get(target) ?? []) watcher.report(target, inView);
};

// The page's CSS hides a group's items while <html> opts in to motion and the group is not yet shown.
const isHidden = (selector: string) =>
  document.documentElement.hasAttribute("data-motion") && !section(selector).hasAttribute("data-shown");

const currentLink = () => document.querySelector('nav a[aria-current="true"]')?.textContent.trim();

const loadPage = async () => {
  const container = await AstroContainer.create({ astroConfig: config });

  document.body.innerHTML = await container.renderToString(Page);
  revealSections(document);
  markCurrentSection(document);
};

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
});

afterEach(() => {
  document.body.replaceChildren();
  delete document.documentElement.dataset["motion"];
  watchers.clear();
  vi.unstubAllGlobals();
  window.happyDOM.settings.device.prefersReducedMotion = "no-preference";
});

test("Page: a section below the fold stays hidden until it scrolls into view", async () => {
  await loadPage();

  expect(isHidden("#docs")).toBe(true);

  scroll("#docs", true);

  expect(isHidden("#docs")).toBe(false);
  expect(isHidden("#run")).toBe(true);
});

test("Page: a shown section stays shown after it scrolls out of view", async () => {
  await loadPage();
  scroll("#run", true);

  scroll("#run", false);

  expect(isHidden("#run")).toBe(false);
});

test("Page: with reduced motion every section is visible from the start", async () => {
  window.happyDOM.settings.device.prefersReducedMotion = "reduce";
  await loadPage();

  expect(document.documentElement.hasAttribute("data-motion")).toBe(false);
  expect(isHidden("header")).toBe(false);
  expect(isHidden("#docs")).toBe(false);
});

test("Page: the nav marks the link of the section in view as current", async () => {
  await loadPage();

  expect(currentLink()).toBeUndefined();

  scroll("#run", true);
  expect(currentLink()).toBe("How it runs");

  scroll("#docs", true);
  scroll("#run", false);
  expect(currentLink()).toBe("Docs it writes");
});
