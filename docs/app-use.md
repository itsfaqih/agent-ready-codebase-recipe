# App use

Use the app driver in `docs/stack.md` whenever you need to interact with the running site directly:

- walking the app to find flows or blockers,
- reproducing a failing spec by hand,
- checking a change before writing its spec,
- capturing screenshots or video of a change for a pull request (`docs/pull-requests.md`), annotated and cropped per `docs/screenshots.md`.

Walk each flow as a user does: through the visible UI only (click, type, navigate), judged by what the user sees on screen. A state set through the API or a script skips what the user would hit.

Open the branch's dev URL (per `docs/worktrees.md`), signed in as a seeded user from the instructions file.

Turn each check that matters into a component test (`docs/component-tests.md`) so the next run repeats it without an agent. Record video with the driver's recording command only for a live interaction that screenshots cannot show.
