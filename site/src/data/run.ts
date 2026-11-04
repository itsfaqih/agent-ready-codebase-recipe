export type Status = "missing" | "partial" | "done";

export type AreaState = Status | "unread" | "recheck";

export type Phase = "audit" | "fill" | "reaudit";

export interface Area {
  readonly name: string;
  readonly summary: string;
  readonly finding: string;
  readonly evidence: string;
  readonly firstAudit: Status;
}

export interface Frame {
  readonly phase: Phase;
  readonly states: readonly AreaState[];
  readonly written: readonly (number | null)[];
  readonly progress: Readonly<Record<Phase, string>>;
  readonly active: number | null;
  readonly filesWritten: number;
  readonly note: string;
  readonly message: string;
  readonly final: boolean;
  readonly holdMs: number;
}

// How long the finished run takes to move away before the next one starts.
export const LEAVE_MS = 640;

const filesWrittenFor: Readonly<Record<Status, number>> = { missing: 2, partial: 1, done: 0 };

export function tally(states: readonly AreaState[]): string {
  const count = (s: Status) => states.filter((x) => x === s).length;

  return `${count("done")} done · ${count("partial")} partial · ${count("missing")} missing`;
}

export function finalMessage(areaCount: number): string {
  return `${areaCount} of ${areaCount} pass`;
}

export function rowText(state: AreaState, area: Pick<Area, "finding" | "evidence">): string {
  if (state === "unread") return "";

  return state === "done" || state === "recheck" ? area.evidence : area.finding;
}

// Before a row has written anything, its last column says what the audit found.
export function lastColumn(state: AreaState, written: number | null): string {
  if (written !== null) return `+${written}`;

  return state === "unread" || state === "recheck" ? "" : state;
}

export function runTimeline(areas: readonly Area[]): Frame[] {
  const frames: Frame[] = [];
  const states: AreaState[] = areas.map(() => "unread");
  const written: (number | null)[] = areas.map(() => null);
  const progress: Record<Phase, string> = { audit: `0/${areas.length}`, fill: "+0", reaudit: `0/${areas.length}` };
  const doneCount = () => states.filter((state) => state === "done").length;
  let filesWritten = 0;

  const push = (phase: Phase, note: string, message: string, holdMs: number, active: number | null = null) =>
    frames.push({
      phase,
      states: [...states],
      written: [...written],
      progress: { ...progress },
      active,
      filesWritten,
      note,
      message,
      final: false,
      holdMs,
    });

  push("audit", "Read only", "Reading the project…", 450);
  areas.forEach((area, i) => {
    states[i] = area.firstAudit;
    progress.audit = `${doneCount()}/${areas.length}`;
    push("audit", "Read only", "Reading the project…", 90);
  });
  push("audit", "Read only", tally(states), 2000);

  areas.forEach((area, i) => {
    if (area.firstAudit === "done") {
      written[i] = 0;

      return;
    }

    const filling = `Filling ${area.name}…`;

    if (area.firstAudit === "missing") {
      states[i] = "partial";
      push("fill", "Writing", filling, 240, i);
    }

    states[i] = "done";
    written[i] = filesWrittenFor[area.firstAudit];
    filesWritten += filesWrittenFor[area.firstAudit];
    progress.fill = `+${filesWritten}`;
    push("fill", "Writing", filling, 300, i);
  });
  push("fill", "Writing", `${filesWritten} files written`, 600);

  states.fill("recheck");
  push("reaudit", "Checking", "Checking again…", 420);
  areas.forEach((_area, i) => {
    states[i] = "done";
    progress.reaudit = `${i + 1}/${areas.length}`;
    push("reaudit", "Checking", "Checking again…", 130, i);
  });

  frames.push({
    phase: "reaudit",
    states: [...states],
    written: [...written],
    progress: { ...progress },
    active: null,
    filesWritten,
    note: "0 on the second audit",
    message: finalMessage(areas.length),
    final: true,
    holdMs: 3800,
  });

  return frames;
}
