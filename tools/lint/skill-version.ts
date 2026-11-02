import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const skill = "skills/setup-agent-ready-codebase";

const manifest = `${skill}/SKILL.md`;

const git = (...args: string[]) => execFileSync("git", args, { encoding: "utf8" }).trim();

const versionIn = (text: string) => /^metadata:\n(?: +.*\n)*? +version: "(\d+\.\d+\.\d+)"$/mu.exec(text)?.[1];

const isHigher = (version: string, than: string) => version.localeCompare(than, "en", { numeric: true }) > 0;

const base = git("merge-base", process.env["SKILL_VERSION_BASE"] || "origin/main", "HEAD");

const version = versionIn(readFileSync(manifest, "utf8"));

const baseVersion = versionIn(git("show", `${base}:${manifest}`));

const changed =
  git("diff", "--name-only", base, "--", skill) !== "" ||
  git("ls-files", "--others", "--exclude-standard", "--", skill) !== "";

if (version === undefined) {
  console.error(`${manifest} needs metadata.version as a quoted x.y.z string`);
  process.exit(1);
}

if (changed && baseVersion !== undefined && !isHigher(version, baseVersion)) {
  console.error(
    `${skill} changed since ${base.slice(0, 7)}, but metadata.version is still ${version}. Raise it: patch for wording, minor for a new stage, doc or check, major when a project set up earlier must redo a stage.`,
  );
  process.exit(1);
}

console.log(`${manifest} is at ${version}`);
