# Component tests

The suite renders each component, drives it as a user would, and asserts what the user sees. On the web, components that depend on real layout run in a browser engine and the rest in a DOM emulator; a native component runs in its platform's test renderer. It runs with `test:components` on the component runner in `docs/stack.md`. Pure logic a component uses is tested through that component, or in `docs/testing.md` when the project has it, and every test also passes `docs/falsifiable-tests.md`.

## States

A component's **states** are the distinct things it can show: the default, each variant, loading, empty, error, disabled, and each state an interaction reaches (open, selected, invalid input). Every interactive component has one test per state, named for it (`Select: Enter opens the list and arrows move the selection`). When the project has stories, each story arranges a state and its interaction test drives it, so a story and its test change together. A change that adds or alters a state adds or updates its test in the same change.

## Writing a test

1. **Arrange** the state with fixed props and data, and frozen time where output depends on the date.
2. **Act** through user events: click or tap, type, and the keyboard path where the platform has one, which keyboard and screen-reader users take.
3. **Assert** what the user and the consumer observe: role, accessible name, text, focus, value, and each callback with its literal arguments.
4. **Capture** the final state to `component-artifacts/<component>/<state>.png` for review, when the runner renders pixels.
5. **Prove it.** Run the red check from `docs/falsifiable-tests.md`, then run the file three times in a row (`test:components "<component>"` with the runner's repeat option). Done when the test has been seen red and the repeated run passes with zero retries.

## Reliability rules

- **Locate by role**, label (the accessibility label on native), or visible text; add a test id only where no accessible name exists.
- **Retrying assertions** wait for the state to arrive. Every wait is on a condition.
- **Data comes from props or fixtures.** A component that fetches gets its network calls stubbed at the boundary, per `docs/hermetic-dependencies.md`.
- **Frozen timers** with the runner's fake clock wherever the component schedules work, and where the runner renders pixels **a fixed viewport or device size**, with fonts loaded before each capture and animations off, except in a test about the animation.
- **Retries stay at 0.** A flaky test is a bug in the test or the component.

The screenshots show a reviewer the state; the assertions are what prove it. A pull request's evidence follows `docs/pull-requests.md`.
