# Component tests

The suite renders each component, drives it as a user would, and asserts what the user sees. Every component here runs in a DOM emulator. It runs with `test:components` on the component runner in `docs/stack.md`. The emulator has no layout, so the one layout rule, each board status message and the install line with its copy icon fitting on one line, runs in a real browser with `test:layout` against the running dev server. Pure logic a component uses is tested through that component, and every test also passes `docs/falsifiable-tests.md`.

## States

A component's **states** are the distinct things it can show: the default, each variant, loading, empty, error, disabled, and each state an interaction reaches (open, selected, invalid input). Every interactive component has one test per state, named for it (`Select: Enter opens the list and arrows move the selection`). When the project has stories, each story arranges a state and its interaction test drives it, so a story and its test change together. A change that adds or alters a state adds or updates its test in the same change.

## Writing a test

1. **Arrange** the state with fixed props and data, and frozen time where output depends on the date.
2. **Act** through user events: click, type, and the keyboard path, which keyboard and screen-reader users take.
3. **Assert** what the user and the consumer observe: role, accessible name, text, focus, value, and each callback with its literal arguments.
4. **Prove it.** Run the red check from `docs/falsifiable-tests.md`, then run the file three times in a row (`test:components <Component>` three times). Done when the test has been seen red and the repeated run passes with zero retries.

## Reliability rules

- **Locate by role**, label, or visible text; add a test id only where no accessible name exists.
- **Retrying assertions** wait for the state to arrive. Every wait is on a condition.
- **Data comes from props or fixtures.**
- **Frozen timers** with the runner's fake clock wherever the component schedules work, since the board and the copy button both schedule work on timers.
- **Retries stay at 0.** A flaky test is a bug in the test or the component.

The screenshots show a reviewer the state; the assertions are what prove it. A pull request's evidence follows `docs/pull-requests.md`.
