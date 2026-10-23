# E2E tests

The suite drives the built app in a real browser through every user **flow**, and saves a screenshot after each step, so a reviewer can follow any flow without running it. Web suites use the e2e runner in `docs/stack.md`; dependencies come from `docs/hermetic-dependencies.md`, seeded users from `docs/agent-access.md`. For a native iOS or Android app, read `docs/e2e-mobile.md` too.

## Two run modes

| Mode | Command | Use |
| --- | --- | --- |
| **On-demand flow** | `test:e2e:flow "<flow name>"` | A change confined to one flow: verify that flow and capture its screenshots, without running the rest |
| **Full suite** | `test:e2e` | A change to code many flows share (auth, layout, shared components, schema, config), and CI |

Both save a screenshot per step to `e2e-artifacts/<flow>/NN-<step>.png`, also attached to the HTML report. A flow's folder holds only its latest run. A flow name is the spec's `test(...)` title, matched as a substring, so `"member renames a project"` runs that one flow. **Scope the run to the change**: one `test:e2e:flow` run per flow the change reaches. CI runs the full suite on every PR, which catches what the scoping missed.

## Video

Record a video only to validate a live interaction that the assertions and step screenshots cannot show: an animation or transition, a drag, a hover or focus sequence, real-time or streamed updates, timing between steps. Run the flow with `E2E_VIDEO=1 test:e2e:flow "<flow name>"`, which adds `e2e-artifacts/<flow>/video.<ext>`, then open the video and check it shows the interaction.

## Flows

The specs are the list of flows. Each flow has one spec: its `test(...)` title is the flow name, its first step opens the entry point as the role (a stored session for that role, or signed out), and its last step asserts the outcome the user came for. A change that adds or alters a flow adds or updates its spec in the same change.

Find flows in the router or pages directory, navigation menus, every form and mutation, auth states, flows started outside the UI (email links, webhooks), and the error paths a user can hit (validation, permission denied, not found, upstream failure). Every route is opened by at least one spec, and every form is submitted by at least one spec.

A comment at the top of the e2e config states what the suite leaves out: the browsers or platforms it has not run on, and each third party replaced by a stub.

## Writing a spec

Explore the flow with the browser driver (`docs/browser.md`) first. Each spec seeds its own data, walks the flow in named steps through the `step` fixture (`e2e/fixtures`), and ends by asserting the outcome the user came for. Run the red check from `docs/falsifiable-tests.md` on the outcome assertion, then run that flow three times in a row (`test:e2e:flow "<flow name>"` with the runner's repeat option). Done when the flow's spec has been seen red and the repeated run passes with zero retries.

## Reliability rules

- **Locate by role**, label, or visible text; add a test id only where no accessible name exists. CSS and XPath selectors break on restyles.
- **Retrying assertions** (assert on a locator, not on a value read earlier) wait until the state arrives. Every wait is on a condition.
- **Own your data**: each test creates the records it needs through the app's API or a DB helper, with unique values (`user-<test id>@example.test`), so tests run in parallel and in any order.
- **Skip the login form** outside the login flow itself: create a session through an API or DB helper and load it as the browser's stored state. The login spec alone exercises the form.
- **Freeze time** with the runner's clock control wherever output depends on the date.
- **Run the production build** (`build` then `start`). Dev servers compile routes on first hit, which turns cold starts into timeouts.
- **Retries stay at 0.** A flaky test is a bug in the test or the app; find the race and fix it.
- **Third parties** run on the `docs/hermetic-dependencies.md` ladder, emulator first, started in global setup beside the database. Browser-level request interception stubs only third-party scripts the browser loads directly (analytics, embeds).

## Evidence

When you report e2e work, give the paths to the HTML report and the `e2e-artifacts/<flow>/` folders for the flows you ran, with any video you recorded. A pull request's evidence follows `docs/pull-requests.md`.
