import { AREAS } from "../data/content";
import { runTimeline, type Frame } from "../data/run";

export function playBoard(root: ParentNode): void {
  const board = root.querySelector<HTMLElement>("[data-board]");

  if (!board || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const tiles = [...board.querySelectorAll<HTMLElement>("[data-area]")];
  const tabs = [...board.querySelectorAll<HTMLElement>("[data-phase]")];
  const line = board.querySelector<HTMLElement>("[data-status-line]");
  const frames = runTimeline(AREAS);

  const render = (frame: Frame) => {
    tiles.forEach((tile, i) => {
      const status = frame.states[i];

      if (status) tile.dataset["status"] = status;
    });

    for (const tab of tabs) {
      if (tab.dataset["phase"] === frame.phase) tab.setAttribute("aria-current", "step");
      else tab.removeAttribute("aria-current");
    }

    if (line) {
      line.textContent = frame.message;
      line.toggleAttribute("data-final", frame.final);
    }
  };

  let index = 0;

  const tick = () => {
    const frame = frames[index % frames.length];

    if (!frame) return;
    render(frame);
    index += 1;
    setTimeout(tick, frame.holdMs);
  };

  tick();
}
