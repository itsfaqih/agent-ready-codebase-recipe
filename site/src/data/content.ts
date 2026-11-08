import type { Area, Phase } from "./run";

export const REPO_URL = "https://github.com/itsfaqih/agent-ready-codebase-recipe";

export const SKILL_COMMAND = "/setup-agent-ready-codebase";

export const INSTALL_COMMAND = "npx skills add itsfaqih/agent-ready-codebase-recipe";

export const HERO_TITLE = "Make your agent's work verifiable in your repo";

export const HERO_LEDE =
  "A skill that audits your repo and adds the checks your agent needs to catch its own mistakes before they reach your review.";

export type ProblemId = "tests" | "sign-in" | "parallel" | "review" | "app" | "logs";

export const PROBLEMS: readonly {
  readonly id: ProblemId;
  readonly title: string;
  readonly body: string;
  readonly before: string;
  readonly after: string;
}[] = [
  {
    id: "tests",
    title: "Your agent's tests don't touch real services",
    body: "Every unit test passes, yet none of them run against the database or services your app uses in production.",
    before: "The tests mock the database, so they pass and the broken query ships.",
    after: "Tests run against a real Postgres, so the bug fails a test and the agent fixes it before your review.",
  },
  {
    id: "sign-in",
    title: "Your agent can't sign in on its own",
    body: "It has no account to sign in with and no database it can reach, so you end up checking that work yourself.",
    before: "The agent stops at the login page and asks you to check.",
    after: "It signs in as a seeded test user and checks the page itself.",
  },
  {
    id: "parallel",
    title: "Two agents can't run the project at once",
    body: "They use the same ports, files and local database, and break each other's runs.",
    before: "The second dev server can't start, because the first one holds the port and the database.",
    after: "Each worktree gets its own URL, ports and database.",
  },
  {
    id: "review",
    title: "You still review what a tool could check",
    body: "Formatting and lint errors reach your review when a formatter and linter could have rejected them first.",
    before: "Your review comments are about an unused import and indentation.",
    after: "The linter and formatter reject those first, so your review covers the feature.",
  },
  {
    id: "app",
    title: "Your agent can't use your app",
    body: "It can't open the app and click through it as a user would, so it never sees what its change does.",
    before: "It reports that the change should work, without having opened the app.",
    after: "It opens the app, clicks through the flow and sees the result.",
  },
  {
    id: "logs",
    title: "Your logs are plain text",
    body: "When something breaks, your agent scrolls through lines of output instead of querying for the request that failed.",
    before: "No request id, so the agent guesses which lines belong to the failure.",
    after: "One event per request, with the user and the failing field, found by its id.",
  },
];

export const RUN_STEPS: readonly { readonly label: string; readonly title: string; readonly body: string }[] = [
  {
    label: "Audit",
    title: "Mark each area with evidence",
    body: "For each area it proposes a depth of full, light or n/a, and you confirm it. Then it marks each area done, partial or missing and cites the file or command output that shows it.",
  },
  {
    label: "Fill the gaps",
    title: "Add only what's missing",
    body: "It leaves done areas alone, finishes partial ones and builds missing ones. You pick the tool for each job, and it merges existing docs instead of overwriting them.",
  },
  {
    label: "Audit again",
    title: "Stop when nothing changes",
    body: "The run ends when every area that applies is done and the second audit changes no file.",
  },
];

export const DOCS: readonly { readonly name: string; readonly file: string; readonly when: string }[] = [
  { name: "Worktrees", file: "worktrees.md", when: "you add a port, path, compose service, migration or env var" },
  {
    name: "Dependencies in tests",
    file: "hermetic-dependencies.md",
    when: "a test needs a database, queue, cloud service or third-party API",
  },
  { name: "Falsifiable tests", file: "falsifiable-tests.md", when: "you write or review any test, or fix a bug" },
  {
    name: "Agent access",
    file: "agent-access.md",
    when: "you add auth, a provider, a verification step or a seeded user",
  },
  { name: "E2E", file: "e2e.md", when: "you add or change a user flow or screen" },
  { name: "Pull request", file: "pull-requests.md", when: "you open or update a pull request" },
  { name: "Lessons", file: "lessons.md", when: "you make the same mistake twice" },
];

// The docs figure's agent gets this task and opens only the docs whose line matches it.
export const DOCS_TASK = {
  task: "Add a Redis cache for sessions",
  reads: [
    { file: "worktrees.md", rule: "Own port per worktree" },
    { file: "hermetic-dependencies.md", rule: "Tests start their own Redis" },
  ],
  caption:
    "The task adds a compose service and a test that needs Redis, so the agent opens those two docs and skips the other five.",
} as const;

export const PHASES: readonly { readonly id: Phase; readonly label: string; readonly short: string }[] = [
  { id: "audit", label: "Audit", short: "Audit" },
  { id: "fill", label: "Fill the gaps", short: "Fill" },
  { id: "reaudit", label: "Audit again", short: "Again" },
];

const alreadyDone = (name: string, summary: string, evidence: string): Area => ({
  name,
  summary,
  finding: evidence,
  evidence,
  firstAudit: "done",
});

export const AREAS: readonly Area[] = [
  alreadyDone("Tools", "You pick one per job", "docs/stack.md"),
  alreadyDone("Parallel work", "Worktrees don't clash", "docs/worktrees.md"),
  {
    name: "Linting",
    summary: "Strict rules per file type",
    finding: "*.sql not linted",
    evidence: "sqlfluff on *.sql",
    firstAudit: "partial",
  },
  {
    name: "Tests",
    summary: "Start their own services",
    finding: "Shared Postgres",
    evidence: "Own Postgres per run",
    firstAudit: "missing",
  },
  {
    name: "Sign-in",
    summary: "Test users, no real accounts",
    finding: "No agent login",
    evidence: "Seeded agent user",
    firstAudit: "partial",
  },
  {
    name: "UI tests",
    summary: "E2E or component tests",
    finding: "No e2e config",
    evidence: "playwright.config.ts",
    firstAudit: "missing",
  },
  {
    name: "App use",
    summary: "Agent can drive the app",
    finding: "No browser driver",
    evidence: "agent-browser",
    firstAudit: "missing",
  },
  {
    name: "Logging",
    summary: "Queryable request logs",
    finding: "console.log only",
    evidence: "JSON per request",
    firstAudit: "missing",
  },
  {
    name: "PR proof",
    summary: "Annotated screenshots",
    finding: "No screenshot step",
    evidence: "docs/screenshots.md",
    firstAudit: "partial",
  },
  {
    name: "Lessons",
    summary: "Repeat mistakes become rules",
    finding: "No docs/lessons.md",
    evidence: "docs/lessons.md",
    firstAudit: "missing",
  },
  {
    name: "Test review",
    summary: "Every test seen failing",
    finding: "No test seen red",
    evidence: "Each test seen red",
    firstAudit: "missing",
  },
  {
    name: "Instructions",
    summary: "Tells agents where to look",
    finding: "No AGENTS.md",
    evidence: "AGENTS.md",
    firstAudit: "missing",
  },
];
