# Component harness (one-time setup)

How to write component tests is `docs/component-tests.md`. This file states what the harness must do, built with the component runner recorded in `docs/stack.md`. A project that already runs component tests keeps its config and tests and adds only the missing pieces. Setup is done when:

- `test:components` runs every component test fully parallel, with retries at 0. On the web, a component whose behavior depends on layout, CSS, or a browser API the DOM emulator lacks runs headless in a real browser engine at a fixed viewport; the rest run in a DOM emulator. On native, each runs in the platform's test renderer, and a simulator or emulator the runner needs is named for the worktree and targeted by id, so parallel worktrees stay apart.
- A server-rendered component renders through its framework's test renderer, and its client script lives in a module the test imports and runs against the rendered markup.
- `test:components "<name>"` runs only the tests whose title or file contains the name.
- Where the runner renders pixels (a browser engine, or a snapshot or golden tool on native), a test's capture call writes `component-artifacts/<component>/<state>.png`, and the folder holds only the latest run. `component-artifacts/` and the runner's output folders are in `.gitignore`, and CI keeps `component-artifacts/` as a build artifact.
- A sample test renders one component, asserts its accessible name, and has been seen red.
