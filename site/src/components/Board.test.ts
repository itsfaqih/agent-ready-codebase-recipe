import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";
import Board from "./Board.astro";
import { playBoard } from "./board";

const areas = () => document.querySelector('[aria-label="The 12 areas the skill checks"]');

const statusLine = () => document.querySelector("[data-status-line]")?.textContent;

const currentPhase = () => document.querySelector('[aria-label="Run phase"] [aria-current="step"]')?.textContent;

const count = (status: string) => areas()?.querySelectorAll(`[data-status="${status}"]`).length;

const testsArea = () => areas()?.querySelector('[data-area="Tests"]')?.getAttribute("data-status");

const renderBoard = async () => {
  const container = await AstroContainer.create();

  document.body.innerHTML = await container.renderToString(Board);
  playBoard(document);
};

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  window.happyDOM.settings.device.prefersReducedMotion = "no-preference";
});

test("Board: plays the first audit, fills the gaps, and finishes on a clean second audit", async () => {
  await renderBoard();
  expect(statusLine()).toBe("Reading the project…");
  expect(currentPhase()).toContain("Audit");

  vi.advanceTimersByTime(1780);
  expect(statusLine()).toBe("2 done · 3 partial · 7 missing");
  expect([count("done"), count("partial"), count("missing")]).toEqual([2, 3, 7]);

  vi.advanceTimersByTime(2000);
  expect(statusLine()).toBe("Building what is missing…");
  expect(currentPhase()).toContain("Fill the gaps");

  vi.advanceTimersByTime(6040);
  expect(statusLine()).toBe("12 done · 0 files changed");
  expect(currentPhase()).toContain("Audit again");
  expect(count("done")).toBe(12);
});

test("Board: moves a missing area through partial before done", async () => {
  await renderBoard();

  vi.advanceTimersByTime(1780);
  expect(testsArea()).toBe("missing");

  vi.advanceTimersByTime(2260);
  expect(testsArea()).toBe("partial");

  vi.advanceTimersByTime(220);
  expect(testsArea()).toBe("done");
});

test("Board: holds the finished board when the visitor prefers reduced motion", async () => {
  window.happyDOM.settings.device.prefersReducedMotion = "reduce";
  await renderBoard();
  vi.advanceTimersByTime(20_000);

  expect(statusLine()).toBe("12 done · 0 files changed");
  expect(currentPhase()).toContain("Audit again");
  expect(count("done")).toBe(12);
});
