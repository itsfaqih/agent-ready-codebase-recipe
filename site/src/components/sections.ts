// A long group stops adding delay here, so its last items never wait on the ones above them.
const STAGGER_CAP = 8;

const motionAllowed = () =>
  "IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Each group enters once, the first time it nears the viewport, and stays shown.
export function revealSections(root: Document): void {
  const html = root.documentElement;

  if (!motionAllowed()) {
    delete html.dataset["motion"];

    return;
  }

  html.dataset["motion"] = "on";

  const observer = new IntersectionObserver(
    (entries) => {
      for (const { target, isIntersecting } of entries) {
        if (!isIntersecting) continue;
        target.toggleAttribute("data-shown", true);
        observer.unobserve(target);
      }
    },
    { rootMargin: "0px 0px -10% 0px" },
  );

  for (const group of root.querySelectorAll<HTMLElement>("[data-reveal-group]")) {
    group.querySelectorAll<HTMLElement>("[data-reveal]").forEach((item, i) => {
      item.style.setProperty("--reveal-i", String(Math.min(i, STAGGER_CAP)));
    });
    // A group's screens print their lines in reading order: a problem's before tile first, the run's steps left to right.
    group.querySelectorAll<HTMLElement>("[data-print]").forEach((line, i) => {
      line.style.setProperty("--print-i", String(i));
    });
    observer.observe(group);
  }
}

// The current section is the one crossing a line 40% down the viewport; above the first one, no link is current.
export function markCurrentSection(root: Document): void {
  if (!("IntersectionObserver" in window)) return;

  const links = new Map<Element, HTMLAnchorElement>();
  const crossing = new Set<Element>();

  for (const link of root.querySelectorAll<HTMLAnchorElement>('nav a[href^="#"]')) {
    const section = root.getElementById(link.hash.slice(1));

    if (section) links.set(section, link);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const { target, isIntersecting } of entries) {
        if (isIntersecting) crossing.add(target);
        else crossing.delete(target);
      }

      const current = [...links.keys()].findLast((section) => crossing.has(section));

      for (const [section, link] of links) {
        if (section === current) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      }
    },
    { rootMargin: "-40% 0px -59% 0px" },
  );

  for (const section of links.keys()) observer.observe(section);
}
