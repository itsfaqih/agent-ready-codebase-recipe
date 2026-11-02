export function bindCopyButtons(root: ParentNode): void {
  for (const button of root.querySelectorAll<HTMLButtonElement>("[data-copy]")) {
    const hint = button.querySelector("[data-copy-hint]");
    const idleHint = hint?.textContent ?? "";

    button.addEventListener("click", async () => {
      const text = button.dataset["copy"];

      if (!hint || text === undefined) return;
      await navigator.clipboard.writeText(text);
      hint.textContent = "Copied";
      button.toggleAttribute("data-copied", true);
      setTimeout(() => {
        hint.textContent = idleHint;
        button.toggleAttribute("data-copied", false);
      }, 1400);
    });
  }
}
