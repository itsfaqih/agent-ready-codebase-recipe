# Component harness (one-time setup)

How to write component tests is `docs/component-tests.md`. This file states what the harness must do, built with the component runner recorded in `docs/stack.md`. A project that already runs component tests keeps its config and tests and adds only the missing pieces. Setup is done when:

- `test:components` runs every component test headless in a real browser engine, at a fixed viewport, fully parallel, with retries at 0.
- `test:components "<name>"` runs only the tests whose title or file contains the name.
- A test's capture call writes `component-artifacts/<component>/<state>.png`, and the folder holds only the latest run.
- `component-artifacts/` and the runner's output folders are in `.gitignore`, and CI keeps `component-artifacts/` as a build artifact.
- A sample test renders one component, asserts its accessible name, and has been seen red.
