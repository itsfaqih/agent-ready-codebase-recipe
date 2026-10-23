# Driving the browser

Use the agent browser driver in `docs/stack.md` whenever you need to interact with the running web app directly:

- walking the app to find flows or blockers,
- reproducing a failing spec by hand,
- checking a change before writing its spec,
- capturing screenshots or video of a change for a pull request (`docs/pull-requests.md`), annotated and cropped per `docs/screenshots.md`.

Open the branch's dev URL (per `docs/worktrees.md`), signed in as a seeded user from the instructions file.

Turn each check that matters into a spec in `e2e/` (`docs/e2e.md`), so the next run repeats it without an agent. Record video with the driver's recording command, under the rule in `docs/e2e.md` (Video).
