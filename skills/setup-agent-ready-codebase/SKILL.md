---
name: setup-agent-ready-codebase
description: Set up a project, new or existing, so any agent in any worktree can change code and prove it works with deterministic checks.
disable-model-invocation: true
metadata:
  version: "1.0.0"
---

# Set up an agent-ready codebase

Bring the current project to a baseline where any agent, in any worktree, can change code, reach every screen, and prove it works. Every check this builds is **deterministic**: a command that returns the same verdict on every run, with no agent judging the result. An agent walking the app or reading a screenshot finds what to check; a test, script, or lint rule then does the checking.

The skill leaves two things behind:

- **Machinery**: config, scripts, harnesses, and tests that run the checks.
- **Instructions**: `AGENTS.md` and `docs/`, which tell every later agent how to use the machinery. `AGENTS.md` holds pointers and project facts; each `docs/*.md` loads only when its pointer fires.

The docs are shipped in [`templates/docs/`](templates/docs/); each is the single source of truth for its rules, and this file and `references/` point to them. A stage is done when the project satisfies the rules in its docs and the stage's criterion holds. `references/` holds setup-only material (harness requirements, tool recommendations) that has no use after setup.

The skill prescribes **principles and checks**. Each job (lint, integration tests, e2e, logging, ...) is done by a tool the user picks in stage 2, and `docs/stack.md` records the pick. The docs name a job ("the e2e runner", "the dependency containers"); the project's tool for it is in `docs/stack.md`. Commands are named by script (`test`, `test:e2e:flow`) and run through the project's task runner.

## Fit the project

Each check is sized to the project it guards. Stage 1 writes the project's **profile**: what it is (web app, API service, component library, CLI, package, static site, mobile app, desktop app), who uses it, where it runs, how many services it has, and what a broken release costs. Every stage from 4 to 11 then gets a **depth** chosen from the profile:

- **`full`**: the stage as written.
- **`light`**: the lighter variant the stage names, for a project the full stage would overbuild.
- **`n/a`**: the project has nothing the stage checks.

Each depth carries a one-line reason drawn from the profile ("a docs site that runs fully on the client: component tests, not e2e"). The audit and the stage's criterion apply at the confirmed depth. An `n/a` stage installs no doc.

The profile also decides which **jobs** the project has, and a tool earns its place only by checking something the project has. Integration tests need a module that crosses a process boundary, e2e needs a UI that talks to a server or another external system (stage 8), mutation and property testing need logic that is costly to get wrong and invariants worth stating, and observability needs a server. [`references/tool-choices.md`](references/tool-choices.md) names the condition beside each conditional job; a job whose condition the profile does not meet gets no tool, no script, and no doc.

For calibration, a static site with no backend, one page or many, needs lint, worktree-safe dev URLs, component tests for its interactive components, and screenshots for its pull requests. Stages 6, 7, and 9 are `n/a` and stage 8 is `light`.

## Audit, then fill the gaps

Every run is **idempotent**: a project already set up changes nothing, and a project partly set up gains only what is missing. Stage 1 audits every stage's criterion against the project and records each as `done`, `partial`, or `missing`, with the command output or file that shows it. A later stage then works only on its delta:

- **`done`**: leave it alone; the report cites the evidence.
- **`partial`**: keep what exists and add the missing pieces. Extend an existing e2e config, e2e specs, CI workflow, lint config, compose file, or `.env.example` instead of replacing it. A job already done by two tools gets one owner, chosen by the user in stage 2; the other tool's files move over as they are touched.
- **`missing`**: build it from the docs and references.

A doc is **installed** by copying its template into `docs/` when no file is there. A file already at that path is merged: keep the project's own lines, add each template rule the file lacks, and where the two conflict the template wins unless the project's line gives a deliberate local reason. Every conflict goes in the report.

Existing code is the first thing the new checks run against. Fix what lint, the integration tests, and the e2e specs find at the root, one stage at a time, so each stage's changes can be reviewed on their own.

The **survey notes** are the run's working notes: the profile, the stack, the external services, each stage's depth and status, the chosen tools, and the app's flows. Keep them outside the project, since nothing in them is committed; the final report carries their results.

Run the stages in order; each later stage leans on the earlier ones. Read a stage's docs and references in full before starting it.

1. **Profile, survey and audit.** Write the profile (Fit the project) from the README, the manifests, the entry points, the deploy and CI config, and the git history; ask the user what the code cannot show, such as who uses the project and what an outage costs. List the stack (languages, frameworks, tools already in use for each job, user-facing surfaces) and every external service the code calls, found by reading SDK imports, env var names, and config, so later stages can pick a substitute for each. Propose a depth for each stage from 4 to 11. Then check each stage's criterion below against the project at that depth. Done when the survey notes hold:
   - the profile,
   - every external service the code calls,
   - whether `AGENTS.md` and `CLAUDE.md` exist, and what each holds,
   - each stage 4 to 11's proposed depth with its reason,
   - each stage 2 to 12 as `done`, `partial`, or `missing`, with its evidence.
2. **Confirm depth, then choose tools and strictness.** Show the user the profile and each stage's proposed depth with its reason, and take their confirmation or change before any tool question, since the depth decides which jobs apply. Read [`references/tool-choices.md`](references/tool-choices.md), which lists each job and the well-known, mature options for it. For every job the profile calls for (Fit the project), ask the user which tool to use. Put the project's current tool first when it has one, then two or three mature options with the recommended one marked and a one-line reason each; the user may name any other tool. Then recommend each **strictness** level in that file's Strictness section that applies to the project's languages, with what it rejects and, when a dry run with the current tools can count them, the findings it raises on the current tree. Ask in batches with the question tool. Done when every stage's depth is confirmed, every applicable job has a user-confirmed tool, and every applicable strictness level is accepted or declined in the survey notes. When no user can answer, take the proposed depth and the recommendations and label each `default, unconfirmed` in the report.
3. **Stack**: `docs/stack.md`. Fill its table with the chosen tools. Install each as a direct dependency (or a pinned binary), at the version the Choosing rules in `references/tool-choices.md` give, and install the agent guide or skill a tool ships, committed with its lockfile so every worktree has it. Done when each applicable job has a row naming its tool, and the command output or file that shows each tool installed is in the survey notes.
4. **Worktrees**: `docs/worktrees.md`. Done when its **Prove it** run passes.
5. **Lint**: `docs/lint.md`, plus `docs/boundaries.md` when the code takes input from outside the program, configured from [`references/lint-config.md`](references/lint-config.md). Done when every file type in the repo is read by the tool of some `lint:<name>` check script, each tool has exactly one check script, and each script exits 0 on the whole tree.
6. **Unit and integration tests**: `docs/testing.md`, `docs/hermetic-dependencies.md`, `docs/falsifiable-tests.md`, with the harness from [`references/integration-harness.md`](references/integration-harness.md). `light` when no module crosses a process boundary: unit tests for pure logic, `docs/testing.md` without its integration sections, and no harness or `docs/hermetic-dependencies.md`. `n/a` when the only logic lives inside components that stage 8 tests. Done when every boundary-crossing module's branch has an integration test that has been seen red, three shuffled runs from a clean state pass, and the "Find missing tests" checks of `docs/testing.md` have run over those modules.
7. **Agent access**: `docs/agent-access.md`, built with [`references/agent-access-setup.md`](references/agent-access-setup.md). `n/a` when no user or client reaches the project through a UI or a public HTTP API, as with a component library, a package, or a CLI. Build the e2e harness from [`references/e2e-harness.md`](references/e2e-harness.md) first, since the agent-access spec runs on it. Done when the agent-access spec passes from a fresh worktree after `setup`.
8. **E2E tests and app use**: `docs/e2e.md` (plus `docs/e2e-mobile.md` for a native app at `full` depth) and, when the project has a UI, `docs/app-use.md`, on the harness built in stage 7. The depth follows where the UI's behavior runs, not how many pages or interactions it has. `full` when the UI talks to a server or another external system (its own backend, an API, a database, an auth provider), since only a run through the real client and server together proves that seam. `light` when the UI runs fully on the client, as with a component library, a design system, an embeddable widget, a native app with no backend, or a static site of any size: install `docs/component-tests.md` in place of `docs/e2e.md` and build its harness from [`references/component-harness.md`](references/component-harness.md); the stage is done when every interactive component has a component test seen red and `test:components` passes three runs in a row. At `full` depth, list the app's flows in the survey notes, found as the Flows section of `docs/e2e.md` describes. Done when every listed flow has a passing spec, and both run modes work: `test:e2e:flow "<flow name>"` (one flow, for a change confined to it) and `test:e2e` (full suite), each leaving a screenshot per step under `e2e-artifacts/<flow>/`, and a run with `E2E_VIDEO=1` also leaves a playable video of each test.
9. **Observability**: `docs/observability.md`. `n/a` when the project runs no server and has no UI. `light` for one service with little traffic, such as an internal tool, a personal app, or a static site with a small API: install the doc without its sections marked full depth. Done when the **Prove it** checks of each installed section pass.
10. **Pull requests, screenshots, and lessons**: `docs/pull-requests.md`, `docs/screenshots.md`, `docs/lessons.md`. For a web UI, copy `templates/tools/annotate.js` to `tools/screenshots/` in the project. Add `.pr/` to `.gitignore`. When the project has no PR template, add one (`.github/pull_request_template.md` on GitHub) with three sections: a one-sentence why, the change outline (a diagram or code-shape sketch), and `## Screenshots`. An existing template gains the `## Screenshots` section. Done when the PR template has a `## Screenshots` section and a crop of a real screen, annotated with the tool on a web UI and made per `docs/screenshots.md` elsewhere, opens with its changes legible.
11. **Falsifiability review**: apply `docs/falsifiable-tests.md` across every test written or kept in stages 6 to 9. Done when each has been seen red against a deliberate break.
12. **Instructions file**: `AGENTS.md` at the repo root, the one file Claude Code, Codex, Cursor, and most other agents read. Create it from [`templates/AGENTS.md`](templates/AGENTS.md), or merge into an existing one: keep every existing line and add each missing pointer and project fact. Fill each fact's placeholder, and drop each pointer whose doc was not installed and each fact that does not apply. A `CLAUDE.md` that only imports `AGENTS.md` (`@AGENTS.md`) is deleted. A `CLAUDE.md` with its own lines has them merged into `AGENTS.md` and is then deleted; each `@path` import in it becomes a pointer line naming when to read that file, since other agents leave imports unexpanded. Done when no `CLAUDE.md` is left, each installed doc has exactly one pointer in `AGENTS.md`, each pointer names an existing file, no placeholder is left, and the file holds nothing a task-runner script list or `--help` already says.

After the last stage, run the audit again. Done when every applicable stage is `done` and the run changed no file. Close with a report: the profile, each stage's depth with its reason, each stage as `already done`, `added`, or `updated`, the command output that shows its criterion holds, the tool chosen for each job with its install evidence, the flows with their specs, each merge conflict, and anything skipped and why.
