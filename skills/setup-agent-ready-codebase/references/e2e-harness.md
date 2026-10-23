# E2E harness (one-time setup)

How to run and write e2e is `docs/e2e.md`. This file states what the harness must do, built with the e2e runner recorded in `docs/stack.md`. Setup is done when:

- `test:e2e` starts its own dependencies and app, runs an empty spec, and leaves an HTML report behind.
- The same run with `E2E_VIDEO=1` also leaves a playable video at `e2e-artifacts/<flow>/video.<ext>` (open it, or read a duration above zero from it), and without it leaves none.
- `test:e2e:flow "<name>"` runs just that spec.

A project with an e2e runner already keeps its config, `e2e/` layout, and specs: add the missing pieces below and leave working specs in place.

## Configuration

- Retries 0; fully parallel; `only`-style focus markers rejected in CI.
- A fixed 1280x720 viewport.
- Video off by default. With `E2E_VIDEO=1` set, every test in the run is recorded, passed or failed, at the viewport's size so text in it stays legible.
- A screenshot at the end of every test, and a trace kept on failure.
- An HTML report that does not open itself.
- Output folders (the runner's output folder, the report folder, `e2e-artifacts/`) in `.gitignore`. CI keeps `e2e-artifacts/` and the report as build artifacts, so a reviewer can watch a run without repeating it.

## Scripts

- `test:e2e` builds the app, then runs the full suite.
- `test:e2e:flow "<name>"` builds the app, then runs only tests whose title contains the name.

Put the build inside the script itself; a pre-script hook is skipped by some task runners.

## Global setup: dependencies and app

Start everything in global setup, in this order, and publish the app's URL through an env var that a fixture reads:

1. Start each dependency from `docs/hermetic-dependencies.md` (database container, one emulator per third party) on random ports.
2. Pick a free port for the app.
3. Build the app's environment from the dependencies' addresses, migrate, and spawn the app's production start command.
4. Poll the app's root until it answers, up to 60 seconds, then fail with the URL and timeout.
5. Return a teardown that kills the app and stops each dependency.

The runner's own web-server option launches before global setup and cannot receive addresses from containers started there, so use global setup. An environment variable set in global setup reaches only code inside tests, so the base-URL fixture reads it; the config does not.

## Fixtures

- **Base URL** from the env var set above.
- **`step(title, body)`** runs the body as a named step in the report, then saves a full-page screenshot numbered in order (`e2e-artifacts/<flow>/NN-<step>.png`) and attaches it to the report. Before the first step, it clears `e2e-artifacts/<flow>/`, so a folder holds only its latest run. Password fields are masked. Only the first copy of a repeated run (the runner's repeat option) writes files, so repeats never overwrite each other.
- **Flow video.** With `E2E_VIDEO=1` set, after the test the fixture copies the test's video to `e2e-artifacts/<flow>/video.<ext>` and attaches it to the report. The runner finishes writing a video only once the test's browser page or context closes, so the copy runs after that close, in the fixture's teardown. The runner's own output folder can be wiped by the next run and names files by hash, so `e2e-artifacts/` is the place a video is read from.

A spec reads as a list of steps, ending with the outcome assertion:

```
test "member renames a project"
  step "open project settings":    go to /projects/alpha/settings
  step "submit the new name":      fill "Project name" with "Beta"; click button "Save"
  step "see the new name in the header": expect heading level 1 to have text "Beta"
```

## Backends in other languages

Keep one browser runner whatever the backend language is: its video, trace, and step-attachment features are what the docs rely on. Global setup spawns the backend's own start command the same way.
