# Pull requests

A reviewer understands the PR from its body alone: why it exists in one sentence, the shape of the change as a diagram or code-shape sketch, and **evidence** that it works: images of what the user sees. Prose stays short; the visuals carry the explanation.

1. **Gates.** Run every lint check for the files the change touches and every test suite the change touches, including `test:e2e:flow "<flow name>"` for each flow it changes (`test:e2e` when it changes code many flows share) and `test:components "<component>"` for each component it changes. Done when all are green on the commit you are about to push.
2. **Gather evidence.** Skip when nothing user-visible changed. Otherwise collect a checked image or video for each changed screen or state, from the first source that has it:
   1. **The e2e flow.** The step 1 run of `test:e2e:flow "<flow name>"` (`docs/e2e.md`) already holds a full-page screenshot per step in `e2e-artifacts/<flow>/`. For a live interaction that screenshots cannot show, rerun the flow with `E2E_VIDEO=1` (`docs/e2e.md`, Video) and copy its video to `.pr/`. Use a full-page step screenshot as is when the change affects the whole page; otherwise recapture that step cropped to the change (source 3, or the annotate helper in the spec).
   2. **The component test.** For a project with `docs/component-tests.md`, the step 1 run already holds a capture per state in `component-artifacts/<component>/`.
   3. **A direct browser capture.** For a state no spec reaches yet, use the agent browser driver (`docs/browser.md`) and capture the screen or state, or record a video for a live interaction.
   4. **The base branch** for a changed screen: capture it too, from a worktree of the base branch at its own dev URL, for a before and after.

   Crop, annotate, and check every screenshot per `docs/screenshots.md`. Save each file to `.pr/` (gitignored) with a name saying what it shows (`after-settings-saved.png`). Done when every user-visible change has a checked image or video. The images show the change to a reviewer; the gates in step 1 are what prove it, so a behaviour seen only in a screenshot gets a spec before the PR opens.
3. **Write the description** by filling every section of the project's PR template. When step 2 gathered no files, delete the `## Screenshots` section. Otherwise fill it, referencing each image by local path (`![After: settings saved](./.pr/after-settings-saved.png)`), with before and after side by side in a table when both exist. Under each image, put its caption from `docs/screenshots.md`.
4. **Publish** with the PR tool in `docs/stack.md`, uploading each file from `.pr/` so its local reference becomes a hosted URL. Read the published body back. Done when the template's sections are present and every image and video reference is a hosted URL.

After later commits change what the user sees, rerun steps 2 to 4 so the evidence matches the head commit.
