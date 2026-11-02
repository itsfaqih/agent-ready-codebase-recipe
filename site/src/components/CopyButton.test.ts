import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";
import { INSTALL_COMMAND } from "../data/content";
import CopyButton from "./CopyButton.astro";
import { bindCopyButtons } from "./copy-button";

const button = () => document.querySelector("button");

beforeEach(async () => {
  vi.useFakeTimers();

  const container = await AstroContainer.create();

  document.body.innerHTML = await container.renderToString(CopyButton, { props: { text: INSTALL_COMMAND } });
  bindCopyButtons(document);
});

afterEach(() => {
  vi.useRealTimers();
});

test("CopyButton: a click copies the command and confirms with Copied", async () => {
  button()?.click();

  await vi.waitFor(() => expect(button()?.textContent).toContain("Copied"));
  expect(await navigator.clipboard.readText()).toBe(INSTALL_COMMAND);
});

test("CopyButton: the confirmation returns to Copy after a moment", async () => {
  button()?.click();
  await vi.waitFor(() => expect(button()?.textContent).toContain("Copied"));

  vi.advanceTimersByTime(1400);
  expect(button()?.textContent).toContain("Copy");
  expect(button()?.textContent).not.toContain("Copied");
});

const renderIconVariant = async () => {
  const container = await AstroContainer.create();

  document.body.innerHTML = await container.renderToString(CopyButton, {
    props: { text: INSTALL_COMMAND, iconLabel: "Copy install command" },
  });
  bindCopyButtons(document);
};

test("CopyButton icon: at rest it is named for the action and leaves the command out", async () => {
  await renderIconVariant();

  expect(button()?.textContent.trim()).toBe("Copy install command");
  expect(button()?.hasAttribute("data-copied")).toBe(false);
});

test("CopyButton icon: a click copies the command and confirms with Copied", async () => {
  await renderIconVariant();
  button()?.click();

  await vi.waitFor(() => expect(button()?.textContent.trim()).toBe("Copied"));
  expect(button()?.hasAttribute("data-copied")).toBe(true);
  expect(await navigator.clipboard.readText()).toBe(INSTALL_COMMAND);
});

test("CopyButton icon: the confirmation returns to its name after a moment", async () => {
  await renderIconVariant();
  button()?.click();
  await vi.waitFor(() => expect(button()?.textContent.trim()).toBe("Copied"));

  vi.advanceTimersByTime(1400);
  expect(button()?.textContent.trim()).toBe("Copy install command");
  expect(button()?.hasAttribute("data-copied")).toBe(false);
});
