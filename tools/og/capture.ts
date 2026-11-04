import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { AREAS } from "../../site/src/data/content.ts";
import { LEAVE_MS, runTimeline } from "../../site/src/data/run.ts";

const base = process.argv[2] ?? "https://agent-ready-codebase-recipe.localhost";

const page = new URL("/og/", base).href;

const publicDir = fileURLToPath(new URL("../../site/public/", import.meta.url));

const work = mkdtempSync(join(tmpdir(), "og-"));

const clock = join(work, "clock.js");

writeFileSync(clock, stripTypeScriptTypes(readFileSync(new URL("clock.ts", import.meta.url), "utf8")));

const FPS = 30;

// The page opens on the finished run, so one loop (that run's hold, its exit, then a whole new run) ends where it began.
const loopMs = runTimeline(AREAS).reduce((sum, frame) => sum + frame.holdMs, LEAVE_MS);

const frameCount = Math.round((loopMs / 1000) * FPS);

// The next run lands at exactly one loop and takes up to 620ms to settle, so the film starts this far into the hold
// and its cut falls on the settled run at both ends.
const START_MS = 1200;

const run = (command: string, args: string[]) => execFileSync(command, args, { encoding: "utf8" });

const browser = (session: string, ...args: string[]) => run("agent-browser", ["--session", session, ...args]).trim();

const waitFor = (session: string, condition: string) => {
  for (let tries = 0; tries < 100; tries += 1) {
    if (browser(session, "eval", `Boolean(${condition})`) === "true") return;
    execFileSync("sleep", ["0.1"]);
  }

  throw new Error(`${page} never reached ${condition}`);
};

const ffmpeg = (...args: string[]) => run("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args]);

try {
  // The share image: the finished run, as a visitor who prefers reduced motion sees it, drawn at 2x and scaled down.
  const still = "arcr-og-still";
  browser(still, "set", "viewport", "1200", "630", "2");
  browser(still, "set", "media", "light", "reduced-motion");
  browser(still, "open", page);
  waitFor(still, `document.fonts.status === "loaded"`);
  browser(still, "screenshot", join(work, "still.png"));
  browser(still, "close");
  ffmpeg("-i", join(work, "still.png"), "-vf", "scale=1200:630:flags=lanczos", join(publicDir, "og.png"));

  // The video: one loop at 1920x1080, every frame at its exact moment on the page's held clock.
  const film = "arcr-og-video";
  browser(film, "--init-script", clock, "set", "viewport", "1280", "720", "1.5");
  browser(film, "open", page);
  waitFor(film, `document.fonts.status === "loaded" && window.filmClock.pending() > 0`);

  for (let frame = 0; frame < frameCount; frame += 1) {
    browser(film, "eval", `window.filmClock.to(${START_MS + (frame * 1000) / FPS})`);
    browser(film, "screenshot", join(work, `${String(frame).padStart(5, "0")}.png`));
  }

  browser(film, "close");

  const frames = ["-framerate", String(FPS), "-i", join(work, "%05d.png"), "-an", "-pix_fmt", "yuv420p"];
  ffmpeg(
    ...frames,
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-crf",
    "20",
    "-movflags",
    "+faststart",
    join(publicDir, "og.mp4"),
  );
  ffmpeg(...frames, "-c:v", "libvpx-vp9", "-crf", "34", "-b:v", "0", "-row-mt", "1", join(publicDir, "og.webm"));

  console.log(
    `Wrote og.png (1200x630) and og.mp4 and og.webm (1920x1080, ${frameCount} frames, ${(loopMs / 1000).toFixed(2)}s loop) to site/public/.`,
  );
} finally {
  rmSync(work, { recursive: true, force: true });
}
