import type { Area, Phase } from "./run";

export const REPO_URL = "https://github.com/itsfaqih/agent-ready-codebase-recipe";

export const SKILL_COMMAND = "/setup-agent-ready-codebase";

export const INSTALL_COMMAND = "npx skills add itsfaqih/agent-ready-codebase-recipe";

export const HERO_LEDE =
  "Stop your agent from shipping mistakes by setting up your project with complete, reliable, and deterministic verification.";

export const PROBLEMS: readonly { readonly title: string; readonly body: string }[] = [
  {
    title: "The tests your agent writes aren't reliable",
    body: "Thousands of unit tests pass, yet none of them use the tools you run in your real environment.",
  },
  {
    title: "Many checks still need you",
    body: "Your agent can't sign in, use a real account or reach a live database on its own, so you end up checking its work yourself.",
  },
  {
    title: "Agents can't run the project at the same time",
    body: "Two agents running at once fight over ports, files and one local database.",
  },
  {
    title: "You still review what a tool could check",
    body: "Formatting slips and lint errors reach your review, when a linter and formatter could have rejected them first.",
  },
  {
    title: "Your agent can't use your app",
    body: "It can't open the app and go through it as a user would, so it never sees what its change does.",
  },
  {
    title: "Your logs are hard to read and query",
    body: "When something breaks, your agent scrolls through plain text instead of looking up the request that failed.",
  },
];

export const RUN_STEPS: readonly { readonly label: string; readonly title: string; readonly body: string }[] = [
  {
    label: "1 · Audit",
    title: "Mark each area, with evidence",
    body: "It proposes a depth for each area (full, light or n/a) for you to confirm. Then it marks each one done, partial or missing and cites the file or command output that shows it.",
  },
  {
    label: "2 · Fill the gaps",
    title: "Add only what's missing",
    body: "It leaves done areas alone, finishes partial ones and builds missing ones. You pick the tool for each job, and it merges existing docs instead of overwriting them.",
  },
  {
    label: "3 · Audit again",
    title: "Stop when nothing changes",
    body: "The run ends when every area that applies is done and the second audit changes no file.",
  },
];

export const DOCS: readonly { readonly file: string; readonly when: string }[] = [
  { file: "worktrees.md", when: "you add a port, path, compose service, migration or env var" },
  { file: "hermetic-dependencies.md", when: "a test needs a database, queue, cloud service or third-party API" },
  { file: "falsifiable-tests.md", when: "you write or review any test, or fix a bug" },
  { file: "agent-access.md", when: "you add auth, a provider, a verification step or a seeded user" },
  { file: "e2e.md", when: "you add or change a user flow or screen" },
  { file: "pull-requests.md", when: "you open or update a pull request" },
  { file: "lessons.md", when: "you make the same mistake twice" },
];

export const PHASES: readonly { readonly id: Phase; readonly label: string }[] = [
  { id: "audit", label: "Audit" },
  { id: "fill", label: "Fill the gaps" },
  { id: "reaudit", label: "Audit again" },
];

export const AREAS: readonly Area[] = [
  { name: "Tools", summary: "You pick one per job", firstAudit: "done" },
  { name: "Parallel work", summary: "Worktrees don't clash", firstAudit: "done" },
  { name: "Linting", summary: "Strict rules per file type", firstAudit: "partial" },
  { name: "Tests", summary: "Start their own services", firstAudit: "missing" },
  { name: "Sign-in", summary: "Test users, no real accounts", firstAudit: "partial" },
  { name: "UI tests", summary: "E2E or component tests", firstAudit: "missing" },
  { name: "App use", summary: "Agent can drive the app", firstAudit: "missing" },
  { name: "Logging", summary: "Queryable request logs", firstAudit: "missing" },
  { name: "PR proof", summary: "Annotated screenshots", firstAudit: "partial" },
  { name: "Lessons", summary: "Repeat mistakes become rules", firstAudit: "missing" },
  { name: "Test review", summary: "Every test seen failing", firstAudit: "missing" },
  { name: "Instructions", summary: "Tells agents where to look", firstAudit: "missing" },
];
