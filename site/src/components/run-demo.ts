import { AREAS } from "../data/content";
import { LEAVE_MS, lastColumn, rowText, runTimeline, type Frame } from "../data/run";

const find = (parent: ParentNode, selector: string) => {
  const element = parent.querySelector<HTMLElement>(selector);

  if (!element) throw new Error(`the run demo has no ${selector}`);

  return element;
};

const toggle = (element: Element, name: string, on: boolean) => element.toggleAttribute(name, on);

const textSpan = (text: string) => {
  const span = document.createElement("span");

  span.textContent = text;

  return span;
};

// The current text fades out as itself, so it is never removed while it can still be seen.
const setText = (host: Element, text: string) => {
  const swap = host.querySelector("[data-swap]");
  const now = host.querySelector("[data-now]");

  if ((now ?? host).textContent === text) return;

  const outgoing = now ?? textSpan(host.textContent);
  const incoming = textSpan(text);

  outgoing.removeAttribute("data-now");
  outgoing.toggleAttribute("data-was", true);
  incoming.toggleAttribute("data-now", true);

  if (swap) {
    swap.replaceChildren(outgoing, incoming);
  } else {
    const created = document.createElement("span");

    created.toggleAttribute("data-swap", true);
    created.append(outgoing, incoming);
    host.replaceChildren(created);
  }
};

const showSession = (session: Element, frame: Frame) => {
  for (const tab of session.querySelectorAll<HTMLElement>("[data-phase]")) {
    const phase = tab.dataset["phase"];

    toggle(tab, "data-on", phase === frame.phase);

    if (phase === "audit" || phase === "fill" || phase === "reaudit") {
      find(tab, "[data-progress]").textContent = frame.progress[phase];
    }
  }

  const activeRow = find(session, "[data-active-row]");

  toggle(activeRow, "data-on", frame.active !== null);
  activeRow.style.transform = `translateY(${(frame.active ?? 0) * 100}%)`;

  AREAS.forEach((area, i) => {
    const row = find(session, `[data-area="${area.name}"]`);
    const state = frame.states[i] ?? "unread";
    const written = frame.written[i] ?? null;
    const last = find(row, "[data-row-written]");

    row.dataset["state"] = state;
    setText(find(row, "[data-row-text]"), rowText(state, area));
    setText(last, lastColumn(state, written));
    last.dataset["rowWritten"] = written === null ? "" : String(written);
    toggle(last, "data-idle", written === 0);

    if (written === null) last.dataset["word"] = state;
    else delete last.dataset["word"];
  });

  setText(find(session, "[data-status-line]"), frame.message);
  find(session, "[data-next-prompt]").dataset["nextPrompt"] = frame.final ? "shown" : "hidden";
};

// Each strip's figures run on past nine, so its position is simply the number it shows and a count only ever rolls forward.
const showCount = (count: HTMLElement, value: number) => {
  const tens = Math.floor(value / 10);

  count.dataset["filesWritten"] = String(value);
  toggle(count, "data-leading-zero", value < 10);
  find(find(count, '[data-digit="tens"]'), "[data-strip]").style.transform = `translateY(-${tens}em)`;
  find(find(count, '[data-digit="ones"]'), "[data-strip]").style.transform = `translateY(-${value}em)`;
};

export function playRunDemo(root: ParentNode): void {
  const demo = root.querySelector<HTMLElement>("[data-run-demo]");

  if (!demo || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const frames = runTimeline(AREAS);

  const frameAt = (index: number): Frame => {
    const frame = frames[index];

    if (!frame) throw new RangeError(`no run frame ${index}`);

    return frame;
  };

  const final = frames.length - 1;
  const card = find(demo, "[data-files-card]");
  const note = find(card, "[data-files-note]");
  const count = find(card, "[data-count]");
  const liveSlot = () => find(demo, '[data-slot="live"]');
  const nextSlot = () => find(demo, '[data-slot="next"]');

  const setLeaving = (on: boolean) => {
    for (const element of [liveSlot(), nextSlot(), card]) toggle(element, "data-leaving", on);
  };

  let index = final;
  let leaving = false;
  let onScreen = false;
  let timer: ReturnType<typeof setTimeout> | undefined;

  // The finished run moves away with its count hidden, so the two sessions swap roles and the count resets out of view.
  const startNewRun = () => {
    const [outgoing, incoming] = [liveSlot(), nextSlot()];
    const opening = frameAt(0);

    leaving = false;
    index = 0;
    setLeaving(false);
    outgoing.dataset["slot"] = "next";
    incoming.dataset["slot"] = "live";
    showSession(outgoing, opening);
    toggle(count, "data-snap", true);
    showCount(count, opening.filesWritten);

    for (const strip of count.querySelectorAll("[data-strip]")) void getComputedStyle(strip).transform;
    toggle(count, "data-snap", false);
  };

  const advance = () => {
    if (leaving) {
      startNewRun();
    } else if (index === final) {
      leaving = true;
      setLeaving(true);
      setText(note, frameAt(0).note);
    } else {
      index += 1;

      const frame = frameAt(index);

      showSession(liveSlot(), frame);
      setText(note, frame.note);
      showCount(count, frame.filesWritten);
    }
  };

  const schedule = () => {
    timer = setTimeout(
      () => {
        advance();
        schedule();
      },
      leaving ? LEAVE_MS : frameAt(index).holdMs,
    );
  };

  // Out of view the run waits on its current frame, and that frame's hold starts over when it comes back.
  const sync = () => {
    clearTimeout(timer);

    if (onScreen && !document.hidden) schedule();
  };

  new IntersectionObserver((entries) => {
    onScreen = entries.some((entry) => entry.isIntersecting);
    sync();
  }).observe(demo);
  document.addEventListener("visibilitychange", sync);
}
