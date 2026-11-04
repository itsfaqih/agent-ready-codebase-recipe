import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";
import RunDemo from "./RunDemo.astro";
import { playRunDemo } from "./run-demo";

let reportVisible: (isIntersecting: boolean) => void = () => undefined;

class FakeIntersectionObserver {
  constructor(private readonly callback: (entries: { isIntersecting: boolean }[]) => void) {}

  observe() {
    reportVisible = (isIntersecting) => this.callback([{ isIntersecting }]);
    reportVisible(true);
  }
}

const renderDemo = async () => {
  const container = await AstroContainer.create();

  document.body.innerHTML = await container.renderToString(RunDemo);
};

const playDemo = async () => {
  await renderDemo();
  playRunDemo(document);
};

const sessionIn = (slot: string) => {
  const session = document.querySelector(`[data-slot="${slot}"] [data-session]`);

  if (!session) throw new Error(`no ${slot} session`);

  return session;
};

const live = () => sessionIn("live");

// A swapped text keeps its outgoing copy beside it while it fades, so what the visitor reads is the current one.
const shownText = (host: Element | null | undefined) => (host?.querySelector("[data-now]") ?? host)?.textContent;

const statusLine = (host: Element = live()) => shownText(host.querySelector("[data-status-line]"));

const stateOf = (area: string) => live().querySelector(`[data-area="${area}"]`)?.getAttribute("data-state");

const wordIn = (area: string) => live().querySelector(`[data-area="${area}"] [data-word]`)?.getAttribute("data-word");

const count = (state: string) => live().querySelectorAll(`[data-area][data-state="${state}"]`).length;

const writtenIn = (area: string) =>
  live().querySelector(`[data-area="${area}"] [data-row-written]`)?.getAttribute("data-row-written");

const textIn = (area: string) => shownText(live().querySelector(`[data-area="${area}"] [data-row-text]`));

const progressOf = (phase: string) => live().querySelector(`[data-phase="${phase}"] [data-progress]`)?.textContent;

const onPhase = () => live().querySelector("[data-phase][data-on]")?.getAttribute("data-phase");

const nextPrompt = () => live().querySelector("[data-next-prompt]")?.getAttribute("data-next-prompt");

const filesWritten = () => document.querySelector("[data-files-written]")?.getAttribute("data-files-written");

const filesNote = () => shownText(document.querySelector("[data-files-note]"));

const cardIsLeaving = () => document.querySelector("[data-files-card]")?.hasAttribute("data-leaving");

const FINAL_HOLD_MS = 3_800;

const LEAVE_MS = 640;

const NEW_RUN_MS = FINAL_HOLD_MS + LEAVE_MS;

const FIRST_AUDIT_MS = 1_530;

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
});

afterEach(() => {
  document.body.replaceChildren();
  vi.unstubAllGlobals();
  vi.useRealTimers();
  window.happyDOM.settings.device.prefersReducedMotion = "no-preference";
  reportVisible = () => undefined;
  Reflect.deleteProperty(document, "hidden");
});

test("RunDemo: the server renders the finished run for visitors without JavaScript", async () => {
  await renderDemo();

  expect(statusLine()).toBe("12 of 12 pass");
  expect(count("done")).toBe(12);
  expect(filesWritten()).toBe("17");
  expect(filesNote()).toBe("0 on the second audit");
  expect(textIn("Lessons")).toBe("docs/lessons.md");
  expect(writtenIn("Lessons")).toBe("2");
  expect(nextPrompt()).toBe("shown");
});

test("RunDemo: stays on the finished run when the visitor prefers reduced motion", async () => {
  window.happyDOM.settings.device.prefersReducedMotion = "reduce";
  await playDemo();

  vi.advanceTimersByTime(20_000);

  expect(statusLine()).toBe("12 of 12 pass");
  expect(count("done")).toBe(12);
  expect(filesWritten()).toBe("17");
  expect(filesNote()).toBe("0 on the second audit");
});

test("RunDemo: holds the finished run, then moves it away for a fresh run", async () => {
  await playDemo();
  const finished = live();

  vi.advanceTimersByTime(FINAL_HOLD_MS - 1);
  expect(cardIsLeaving()).toBe(false);

  vi.advanceTimersByTime(1);
  expect(cardIsLeaving()).toBe(true);
  expect(filesNote()).toBe("Read only");

  vi.advanceTimersByTime(LEAVE_MS);
  expect(cardIsLeaving()).toBe(false);
  expect(live()).not.toBe(finished);
  expect(statusLine()).toBe("Reading the project…");
  expect(filesWritten()).toBe("0");
  expect(sessionIn("next")).toBe(finished);
  expect(statusLine(finished)).toBe("Reading the project…");
});

test("RunDemo: reads every area, then reports the first audit's tally on its tab", async () => {
  await playDemo();

  vi.advanceTimersByTime(NEW_RUN_MS);
  expect(statusLine()).toBe("Reading the project…");
  expect(count("unread")).toBe(12);
  expect(progressOf("audit")).toBe("0/12");
  expect(nextPrompt()).toBe("hidden");

  vi.advanceTimersByTime(FIRST_AUDIT_MS);
  expect(statusLine()).toBe("2 done · 3 partial · 7 missing");
  expect([count("done"), count("partial"), count("missing")]).toEqual([2, 3, 7]);
  expect(progressOf("audit")).toBe("2/12");
  expect(textIn("Tests")).toBe("Shared Postgres");
  expect(writtenIn("Tests")).toBe("");
  expect(shownText(live().querySelector('[data-area="Tests"] [data-word]'))).toBe("missing");
  expect(wordIn("Tests")).toBe("missing");
});

test("RunDemo: fills a missing area through partial to done, and its row says what it wrote", async () => {
  await playDemo();

  vi.advanceTimersByTime(NEW_RUN_MS + FIRST_AUDIT_MS + 2_000);
  expect(onPhase()).toBe("fill");
  expect(filesWritten()).toBe("1");
  expect(stateOf("Tests")).toBe("missing");
  expect(writtenIn("Linting")).toBe("1");
  expect(writtenIn("Tools")).toBe("0");

  vi.advanceTimersByTime(300);
  expect(stateOf("Tests")).toBe("partial");
  expect(statusLine()).toBe("Filling Tests…");
  expect(writtenIn("Tests")).toBe("");
  expect(wordIn("Tests")).toBe("partial");

  vi.advanceTimersByTime(240);
  expect(stateOf("Tests")).toBe("done");
  expect(textIn("Tests")).toBe("Own Postgres per run");
  expect(writtenIn("Tests")).toBe("2");
  expect(wordIn("Tests")).toBeUndefined();
  expect(progressOf("fill")).toBe("+3");
  expect(filesWritten()).toBe("3");
});

test("RunDemo: the second audit writes nothing, and only its end says so", async () => {
  await playDemo();

  vi.advanceTimersByTime(NEW_RUN_MS + FIRST_AUDIT_MS + 2_000 + 4_680 + 600);
  expect(onPhase()).toBe("reaudit");
  expect(statusLine()).toBe("Checking again…");
  expect(count("recheck")).toBe(12);
  expect(textIn("Tests")).toBe("Own Postgres per run");
  expect(filesWritten()).toBe("17");

  vi.advanceTimersByTime(420);
  expect(count("done")).toBe(1);
  expect(count("recheck")).toBe(11);
  expect(progressOf("reaudit")).toBe("1/12");

  vi.advanceTimersByTime(12 * 130 - 1);
  expect(filesNote()).toBe("Checking");

  vi.advanceTimersByTime(1);
  expect(filesWritten()).toBe("17");
  expect(filesNote()).toBe("0 on the second audit");
  expect(statusLine()).toBe("12 of 12 pass");
  expect(count("done")).toBe(12);
  expect(nextPrompt()).toBe("shown");
});

test("RunDemo: waits on its frame while off screen, and starts that frame's hold over when it returns", async () => {
  await playDemo();

  vi.advanceTimersByTime(FINAL_HOLD_MS - 1);
  reportVisible(false);
  vi.advanceTimersByTime(20_000);
  expect(cardIsLeaving()).toBe(false);

  reportVisible(true);
  vi.advanceTimersByTime(FINAL_HOLD_MS - 1);
  expect(cardIsLeaving()).toBe(false);

  vi.advanceTimersByTime(1);
  expect(cardIsLeaving()).toBe(true);
});

test("RunDemo: waits on its frame while the tab is hidden", async () => {
  await playDemo();

  Object.defineProperty(document, "hidden", { configurable: true, value: true });
  document.dispatchEvent(new Event("visibilitychange"));
  vi.advanceTimersByTime(20_000);
  expect(cardIsLeaving()).toBe(false);

  Reflect.deleteProperty(document, "hidden");
  document.dispatchEvent(new Event("visibilitychange"));
  vi.advanceTimersByTime(FINAL_HOLD_MS);
  expect(cardIsLeaving()).toBe(true);
});
