export type Status = "missing" | "partial" | "done";

export type Phase = "audit" | "fill" | "reaudit";

export interface Area {
  readonly name: string;
  readonly summary: string;
  readonly firstAudit: Status;
}

export interface Frame {
  readonly phase: Phase;
  readonly states: readonly Status[];
  readonly message: string;
  readonly final: boolean;
  readonly holdMs: number;
}

export function tally(states: readonly Status[]): string {
  const count = (s: Status) => states.filter((x) => x === s).length;

  return `${count("done")} done · ${count("partial")} partial · ${count("missing")} missing`;
}

export function finalMessage(areaCount: number): string {
  return `${areaCount} done · 0 files changed`;
}

export function runTimeline(areas: readonly Area[]): Frame[] {
  const frames: Frame[] = [];
  const states: Status[] = areas.map(() => "missing");

  const push = (phase: Phase, message: string, holdMs: number, final = false) =>
    frames.push({ phase, states: [...states], message, final, holdMs });

  push("audit", "Reading the project…", 700);
  areas.forEach((area, i) => {
    states[i] = area.firstAudit;
    push("audit", "Reading the project…", 90);
  });
  push("audit", tally(states), 2000);

  areas.forEach((area, i) => {
    if (area.firstAudit === "done") return;

    if (area.firstAudit === "missing") {
      states[i] = "partial";
      push("fill", "Building what is missing…", 220);
    }

    states[i] = "done";
    push("fill", "Building what is missing…", 260);
  });
  push("fill", "Building what is missing…", 600);

  push("reaudit", "Checking again…", 1300);
  push("reaudit", finalMessage(areas.length), 3800, true);

  return frames;
}
