# Tool choices

The one file that names tools. Stage 2 reads it to ask the user which tool does each job; every other file names the job. Each row lists well-known, mature options with the recommended one first. The user's pick, or a tool of their own naming, goes into `docs/stack.md`.

Skip a row whose job the project does not have (no UI, no server, no infrastructure) or whose stage is `n/a`.

| Job | Options (recommended first) | Why the first |
| --- | --- | --- |
| Dependency manager | pnpm, npm, yarn; Python: uv, poetry; Go modules; cargo | pnpm and uv share a global store, so each worktree costs links rather than copies |
| Dev-server ports and URLs | portless, a free-port helper in the dev script, Compose-assigned ports | a free port per run and a name per branch, with no port in any file |
| Backend (new parts) | the project's own; TypeScript: Hono, Fastify, Express; Python: FastAPI; Go: net/http | typed handlers and a small surface |
| Web frontend (new parts) | the project's own; TanStack Start, SvelteKit, Remix, Next.js | a maintained full-stack router with a production build |
| Interactive UI primitives | Base UI, React Aria | unstyled and accessible, so the project's styles apply |
| Infrastructure as code | the project's own; OpenTofu, Alchemy (TypeScript, infrastructure as Effect programs), Pulumi, AWS CDK | declarative, with a plan step and a large provider set |
| Linter | TS/JS: Oxlint or ESLint, Biome; Python: ruff; Go: golangci-lint; Rust: clippy; Shell: shellcheck; Dockerfile: hadolint; GitHub Actions: actionlint | type-aware rules, fast enough to run after every batch of edits |
| Formatter | TS/JS: Oxfmt, Prettier, Biome; Python: ruff format; Go: gofmt; Rust: rustfmt; Shell: shfmt | one canonical layout, run in check mode once over every file type it reads, by its one lint check |
| Type checker | TS: tsc or tsrs; Python: pyright or mypy; Go and Rust: the compiler | the language's reference checker, or a faster port of it |
| Schema validation at boundaries | TS: Zod, Valibot, Effect Schema (Effect v4); Python: pydantic; Go: struct tags with a validator | decodes and types in one step |
| Utility library (TypeScript only) | the project's own; Effect v4 | typed errors, dependency injection, retries and concurrency in one library |
| Unit and integration runner | TS/JS: Vitest or Jest; Python: pytest; Go: `go test`; Java: JUnit | one config for unit and integration projects, run in parallel and shuffled |
| Dependency containers | Testcontainers (all major languages), Compose through the same library | random host ports, pinned images, cleanup after a killed run |
| Third-party API emulation | emulate (GitHub, Google, Stripe, Slack, ...), WireMock, MSW for stateless calls, Mailpit for SMTP | stateful and in-process, with real OAuth flows |
| Cloud emulation | AWS: Floci, moto; Azure: Azurite | one endpoint override, no test branch in production code |
| Component test runner | Storybook test runner when the project has stories, Vitest browser mode | each story is a test's arrangement, so stories and tests change together; without stories, Vitest runs component tests beside the unit tests |
| Web e2e runner | Playwright, Cypress | video, trace, and per-step attachments built in |
| Mobile e2e driver | the project's own; Appium, Maestro, Detox | one flow file for both platforms |
| Browser driver for agents | agent-browser, Playwright MCP, Chrome DevTools MCP | a command-line session an agent drives without a test file |
| Wide-event logging | evlog (TypeScript), structlog (Python), slog (Go), pino with a canonical-line wrapper, OpenTelemetry logs | one event per request, enriched through the request |
| Log store and viewer | VictoriaLogs, Grafana with Loki | a query API an agent can call, and a local stack that runs in Compose |
| Product analytics | Umami, Plausible | self-hostable and cookieless |
| PR descriptions and evidence | the GitHub CLI (`gh`, 2.101 or later) | `gh pr create` and `gh pr edit` take `--attach <path>`, upload the file, and rewrite its local reference to the hosted URL |
| Mutation testing (optional) | StrykerJS, mutmut, PIT, cargo-mutants | automates the red check across a whole suite |
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

- The tool the project already uses for a job is the default. The user may keep it, or move to another option, which migrates as files are touched.
- List only tools with an OSI-approved open-source license that is free for commercial use, and no paid tier needed for the job. Check the license before adding a row. Hosted-only, source-available (BSL, SSPL) and proprietary tools stay out.
- Prefer a tool with a command-line interface and deterministic output, since agents run it in every worktree with no account.
- Recommend a tool the project can run with only Docker present on the machine.
- When the user names a tool absent from this table, accept it if it meets the bullets above, and say so in the report when it does not.
