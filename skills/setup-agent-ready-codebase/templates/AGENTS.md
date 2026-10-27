# Agent instructions

Every check here is a command with a deterministic verdict. A check done by hand (a browser walk, a curl, reading output) becomes a test, script, or lint rule before the work is called done.

## Read a doc when

- **Stack**: you pick or swap a tool, or start or restructure a backend, frontend, or infrastructure → `docs/stack.md`
- **Worktrees**: you add a port, path, compose service, migration, or env var → `docs/worktrees.md`
- **Lint**: you add a file type or hit a lint finding → `docs/lint.md`
- **Boundaries**: you handle input from outside the program (HTTP, database, env, JSON) or branch on a union → `docs/boundaries.md`
- **Testing**: you write or change a unit or integration test, or look for missing tests → `docs/testing.md`
- **Dependencies in tests**: a test needs a database, queue, cloud service, or third-party API → `docs/hermetic-dependencies.md`
- **Falsifiable tests**: you write or review any test, or fix a bug → `docs/falsifiable-tests.md`
- **Agent access**: you add auth, a provider, a verification step, or a seeded user → `docs/agent-access.md`
- **E2E**: you add or change a user flow or screen → `docs/e2e.md`
- **Component tests**: you add or change a component or one of its states → `docs/component-tests.md`
- **Mobile E2E**: you add or change a flow in the native iOS or Android app → `docs/e2e-mobile.md`
- **Browser**: you interact with the running web app directly → `docs/browser.md`
- **Observability**: you add a route, a log line, or an analytics event → `docs/observability.md`
- **Screenshots**: you capture an image for a PR or report → `docs/screenshots.md`
- **Pull request**: you open or update a PR → `docs/pull-requests.md`
- **Lessons**: you make the same mistake twice (the user corrects it twice, or a fix undoes earlier work) → `docs/lessons.md`

## Project facts

- Dev URLs: `<DEV URL PATTERN>`
- Tool guides: `<ONE POINTER PER CHOSEN TOOL THAT SHIPS AN AGENT GUIDE>`
- Seeded users: `<ROLE: EMAIL / PASSWORD, ONE PER LINE>`
- Query a request's wide event: `<COMMAND>`
