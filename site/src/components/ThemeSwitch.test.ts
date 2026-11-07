import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";
import config from "../../../astro.config.mjs";
import Page from "../pages/index.astro";
import ThemeSwitch from "./ThemeSwitch.astro";
import { bindThemeSwitch } from "./theme-switch";

const button = () => document.querySelector<HTMLButtonElement>('button[aria-label="Dark mode"]');

const html = document.documentElement;

const setSystem = (scheme: "light" | "dark") => {
  window.happyDOM.settings.device.prefersColorScheme = scheme;
  window.dispatchEvent(new Event("resize"));
};

const render = async () => {
  const container = await AstroContainer.create();

  document.body.innerHTML = await container.renderToString(ThemeSwitch);
  bindThemeSwitch(document);
};

// The whole page, with its head scripts run in order before the switch binds, as a browser loads it.
const loadPage = async () => {
  const container = await AstroContainer.create({ astroConfig: config });
  const page = new DOMParser().parseFromString(await container.renderToString(Page), "text/html");

  window.happyDOM.settings.enableJavaScriptEvaluation = true;
  document.head.replaceChildren(
    ...[...page.head.childNodes].map((node) =>
      node instanceof HTMLScriptElement
        ? Object.assign(document.createElement("script"), { textContent: node.textContent })
        : node,
    ),
  );
  window.happyDOM.settings.enableJavaScriptEvaluation = false;
  document.body.replaceChildren(...page.body.childNodes);
  bindThemeSwitch(document);
};

const chromeColors = () =>
  [...document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')].map((meta) => meta.content);

const blocked = () => {
  throw new DOMException("The operation is insecure.", "SecurityError");
};

beforeEach(() => {
  setSystem("light");
  localStorage.clear();
  delete html.dataset["theme"];
});

afterEach(() => {
  document.head.replaceChildren();
  document.body.replaceChildren();
  delete html.dataset["motion"];
  vi.unstubAllGlobals();
});

test("ThemeSwitch: with nothing stored it shows the system's light scheme as not pressed", async () => {
  await render();

  expect(button()?.getAttribute("aria-pressed")).toBe("false");
  expect(html.dataset["theme"]).toBeUndefined();
  expect(localStorage.getItem("theme")).toBeNull();
});

test("ThemeSwitch: with nothing stored it shows the system's dark scheme as pressed", async () => {
  setSystem("dark");
  await render();

  expect(button()?.getAttribute("aria-pressed")).toBe("true");
});

test("ThemeSwitch: with nothing stored it follows a live change of the system scheme", async () => {
  await render();
  setSystem("dark");

  expect(button()?.getAttribute("aria-pressed")).toBe("true");
});

test("ThemeSwitch: a click switches to dark and stores the choice", async () => {
  await render();
  button()?.click();

  expect(html.dataset["theme"]).toBe("dark");
  expect(button()?.getAttribute("aria-pressed")).toBe("true");
  expect(localStorage.getItem("theme")).toBe("dark");
});

test("ThemeSwitch: a second click switches back to light and stores that", async () => {
  await render();
  button()?.click();
  button()?.click();

  expect(html.dataset["theme"]).toBe("light");
  expect(button()?.getAttribute("aria-pressed")).toBe("false");
  expect(localStorage.getItem("theme")).toBe("light");
});

test("ThemeSwitch: a click points the browser chrome at the dark background", async () => {
  await loadPage();
  expect(chromeColors()).toEqual(["#fafafa", "#0a0a0a"]);

  button()?.click();

  expect(chromeColors()).toEqual(["#0a0a0a", "#0a0a0a"]);
});

test("ThemeSwitch: on load a stored dark choice holds over a light system", async () => {
  localStorage.setItem("theme", "dark");
  await loadPage();

  expect(html.dataset["theme"]).toBe("dark");
  expect(button()?.getAttribute("aria-pressed")).toBe("true");
  expect(chromeColors()).toEqual(["#0a0a0a", "#0a0a0a"]);
});

test("ThemeSwitch: on load a stored light choice holds over a dark system, and a click turns it dark", async () => {
  setSystem("dark");
  localStorage.setItem("theme", "light");
  await loadPage();

  expect(html.dataset["theme"]).toBe("light");
  expect(button()?.getAttribute("aria-pressed")).toBe("false");

  button()?.click();

  expect(html.dataset["theme"]).toBe("dark");
  expect(localStorage.getItem("theme")).toBe("dark");
});

test("ThemeSwitch: a stored choice ignores a later change of the system scheme", async () => {
  localStorage.setItem("theme", "dark");
  await loadPage();
  setSystem("light");

  expect(html.dataset["theme"]).toBe("dark");
  expect(button()?.getAttribute("aria-pressed")).toBe("true");
});

test("ThemeSwitch: on load a stored value that is not a scheme leaves the page on the system scheme", async () => {
  localStorage.setItem("theme", "sepia");
  await loadPage();

  expect(html.dataset["theme"]).toBeUndefined();
  expect(button()?.getAttribute("aria-pressed")).toBe("false");
  expect(chromeColors()).toEqual(["#fafafa", "#0a0a0a"]);
});

test("ThemeSwitch: with storage blocked the page loads on the system scheme and a click still switches", async () => {
  vi.stubGlobal("localStorage", { getItem: blocked, setItem: blocked });
  setSystem("dark");
  await loadPage();

  expect(html.dataset["theme"]).toBeUndefined();
  expect(button()?.getAttribute("aria-pressed")).toBe("true");

  button()?.click();

  expect(html.dataset["theme"]).toBe("light");
  expect(button()?.getAttribute("aria-pressed")).toBe("false");
});
