# Tool choices

The one file that names tools. Stage 2 reads it to ask the user which tool does each job; every other file names the job. Each row lists well-known, mature options with the recommended one first. The user's pick, or a tool of their own naming, goes into `docs/stack.md`.

A row applies only when the project has its job. A job in italics names its condition after a dash; skip the row when the profile does not meet it, or when its stage is `n/a`.

| Job | Options (recommended first) | Why the first |
| --- | --- | --- |
| Dependency manager | pnpm, npm, yarn; Python: uv, poetry; Go modules; cargo | pnpm and uv share a global store, so each worktree costs links rather than copies |
| Dev-server ports and URLs | portless, a free-port helper in the dev script, Compose-assigned ports | a free port per run and a name per branch, with no port in any file |
| Backend (new parts) | the project's own; TypeScript: Hono, Fastify, Express; Python: FastAPI; Go: net/http | typed handlers and a small surface |
| Web frontend (new parts) | the project's own; TanStack Start, SvelteKit, Remix, Next.js | a maintained full-stack router with a production build |
| Interactive UI primitives | Base UI, React Aria | unstyled and accessible, so the project's styles apply |
| Infrastructure as code | the project's own; OpenTofu, Alchemy (TypeScript, infrastructure as Effect programs), Pulumi, AWS CDK | declarative, with a plan step and a large provider set |
| Linter | TS/JS: Oxlint, Biome, ESLint; Python: ruff; Go: golangci-lint; Rust: clippy; Shell: shellcheck; Dockerfile: hadolint; GitHub Actions: actionlint | type-aware rules on the native TypeScript checker, fast enough to run after every batch of edits |
| Formatter | TS/JS: Oxfmt, Biome, Prettier; Python: ruff format; Go: gofmt; Rust: rustfmt; Shell: shfmt | the fastest, and one tool for JS, TS, JSON, YAML, Markdown, HTML, and Astro (SVG through its HTML formatter), run in check mode by its one lint check |
| Type checker | TS: tsrs (a Rust port of TypeScript 7), TypeScript 7 (`tsc`), TypeScript 6; Python: pyright or mypy; Go and Rust: the compiler | the fastest checker with TypeScript's own diagnostics; run without `--fast`, since its machine-dependent checker count can change them |
| Schema validation at boundaries _- the code takes input from outside the program_ | TS: Zod, Valibot, Effect Schema (Effect v4); Python: pydantic; Go: struct tags with a validator | decodes and types in one step |
| Utility library (TypeScript only) | the project's own; Effect v4 | typed errors, dependency injection, retries and concurrency in one library |
| Unit and integration runner | TS/JS: Vitest or Jest; Python: pytest; Go: `go test`; Java: JUnit | one config for unit and integration projects, run in parallel and shuffled |
| Dependency containers _- a test needs a database, queue, or other service_ | Testcontainers (all major languages), Compose through the same library | random host ports, pinned images, cleanup after a killed run |
| Third-party API emulation _- the code calls a third-party API_ | emulate (GitHub, Google, Stripe, Slack, ...), WireMock, MSW for stateless calls, Mailpit for SMTP | stateful and in-process, with real OAuth flows |
| Cloud emulation _- the code calls a cloud service_ | AWS: Floci, moto; Azure: Azurite | one endpoint override, no test branch in production code |
| Component test runner _- stage 8 is `light`: the UI runs fully on the client_ | Web, Electron and Tauri: Storybook test runner when the project has stories, Vitest browser mode, Vitest with a DOM emulator (happy-dom); React Native: React Native Testing Library; Flutter: `flutter_test`; iOS: ViewInspector on Swift Testing, with swift-snapshot-testing for captures; Android: Compose UI Test on Robolectric, with Paparazzi for captures | web: each story is a test's arrangement, so stories and tests change together; without stories, Vitest runs component tests beside the unit tests, in a DOM emulator when no component depends on real layout. Native: each renders one component in the test process, with no app build to drive |
| Web e2e runner _- stage 8 is `full`: the UI talks to a server or another external system_ | Playwright, Cypress | video, trace, and per-step attachments built in |
| Mobile e2e driver _- stage 8 is `full` and the project ships a native app_ | the project's own; Appium, Maestro, Detox | one flow file for both platforms |
| App driver for agents _- the project has a UI; each surface it ships gets its own row in `docs/stack.md`_ | Web and Electron: agent-browser, Playwright MCP, Chrome DevTools MCP; iOS and Android: mobile-mcp, Appium, Maestro; other desktop apps: Appium with its platform driver; terminal UI: tmux | a live session an agent drives step by step, with no test file |
| Wide-event logging _- stage 9 applies_ | evlog (TypeScript), structlog (Python), slog (Go), pino with a canonical-line wrapper, OpenTelemetry logs | one event per request, enriched through the request |
| Log store and viewer _- stage 9 is `full`_ | VictoriaLogs, Grafana with Loki | a query API an agent can call, and a local stack that runs in Compose |
| Product analytics _- the user wants usage data_ | Umami, Plausible | self-hostable and cookieless |
| PR descriptions and evidence | the GitHub CLI (`gh`, 2.101 or later) | `gh pr create` and `gh pr edit` take `--attach <path>`, upload the file, and rewrite its local reference to the hosted URL |
| Property-based testing _- pure logic with an invariant (round trip, idempotence, ordering, bounds), such as a parser, serializer, or money math_ | fast-check (TS/JS), Hypothesis (Python), rapid (Go), proptest (Rust) | generates and shrinks inputs, so invariants are checked beyond hand-picked examples |
| Mutation testing _- stage 6 is `full` and a broken release is costly_ | StrykerJS, mutmut, PIT, cargo-mutants | automates the red check across a whole suite |
| Pre-commit hooks (optional) | lefthook, husky | staged-file lint before each commit |

## Strictness

Each level makes the checks reject more **low-evidence** code: code the checker cannot show is correct, such as an assertion that invents a type, an `unknown` passed on unparsed, an unchecked index, or a swallowed error. Stage 2 recommends every level that applies; the user accepts or declines each one, and an accepted level is set up in stage 5 (compiler and rules) or stage 3 (library).

| Level | TypeScript and JavaScript | Python | Go | Rust |
| --- | --- | --- | --- | --- |
| Strict compiler | `strict`, plus `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `noPropertyAccessFromIndexSignature` | pyright in `strict` mode, or `mypy --strict` | `go vet` in the Go lint check | `#![forbid(unsafe_code)]` |
| Low-evidence rule pack | anti-slop, an Oxlint plugin copied into the repo (needs Oxlint as the linter), with its Effect rule group when the project uses Effect | ruff's `ANN`, `BLE`, and `TRY` rule sets | golangci-lint's `errcheck`, `exhaustive`, and `forcetypeassert` | clippy's `pedantic` group, plus `unwrap_used` and `expect_used` |
| Typed effects | Effect v4 (the utility library row) | no option listed | errors are already values | errors are already values |

To count a level's findings before the user decides, pass the stricter settings on the command line (`tsc --noEmit --noUncheckedIndexedAccess`) or run the rule pack against a copy of the config, and leave the project's config unchanged until the user accepts.

## Choosing

- The tool the project already uses for a job is the default, at the version it has. The user may keep it, or move to another option, which migrates as files are touched.
- A job with no tool yet, as in a fresh setup, gets the fastest maintained option at its latest release, pinned to the exact version while it is pre-1.0.
- When a tool the project needs cannot run on that release yet, the project still takes the latest, and only that tool gets the older one, isolated where the project cannot resolve it (a nested workspace package that depends on it). `docs/stack.md` names the hold-back and its reason in that tool's row, so it is dropped once the tool catches up. For example, `astro check` loads TypeScript through the JavaScript API that TypeScript 7 and tsrs no longer ship, so it runs from its own package with TypeScript 6 while the project checks with tsrs.
- List only tools with an OSI-approved open-source license that is free for commercial use, and no paid tier needed for the job. Check the license before adding a row. Hosted-only, source-available (BSL, SSPL) and proprietary tools stay out.
- Prefer a tool with a command-line interface and deterministic output, since agents run it in every worktree with no account.
- Recommend a tool the project can run with only Docker present on the machine.
- When the user names a tool absent from this table, accept it if it meets the bullets above, and say so in the report when it does not.
