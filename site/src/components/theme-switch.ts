import { chromeColor, type Scheme, systemDark, themeKey } from "../styles/scheme";

export function bindThemeSwitch(root: ParentNode): void {
  const html = document.documentElement;
  const system = matchMedia(systemDark);

  const showing = (): Scheme => {
    const chosen = html.dataset["theme"];

    if (chosen === "light" || chosen === "dark") return chosen;

    return system.matches ? "dark" : "light";
  };

  for (const button of root.querySelectorAll<HTMLButtonElement>("[data-theme-switch]")) {
    const sync = () => button.setAttribute("aria-pressed", String(showing() === "dark"));

    system.addEventListener("change", sync);
    button.addEventListener("click", () => {
      const next: Scheme = showing() === "dark" ? "light" : "dark";

      html.toggleAttribute("data-theme-switching", true);
      html.dataset["theme"] = next;

      for (const meta of document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')) {
        meta.content = chromeColor[next];
      }

      try {
        localStorage.setItem(themeKey, next);
      } catch {
        // Storage is blocked (a private window, a site-data setting): the choice holds until the page closes.
      }

      sync();
      // Styles recompute with transitions off, so no color eases; they come back once that frame has drawn.
      html.getBoundingClientRect();
      requestAnimationFrame(() => requestAnimationFrame(() => html.removeAttribute("data-theme-switching")));
    });
    sync();
  }
}
