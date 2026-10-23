# Component tests

The suite renders each component in a real browser, drives it as a user would, and asserts what the user sees. It runs with `test:components` on the component runner in `docs/stack.md`. Pure logic stays in `docs/testing.md`, and every test also passes `docs/falsifiable-tests.md`.

## States

A component's **states** are the distinct things it can show: the default, each variant, loading, empty, error, disabled, and each state an interaction reaches (open, selected, invalid input). Every interactive component has one test per state, named for it (`Select: Enter opens the list and arrows move the selection`). When the project has stories, each story arranges a state and its interaction test drives it, so a story and its test change together. A change that adds or alters a state adds or updates its test in the same change.

## Writing a test

1. **Arrange** the state with fixed props and data, and frozen time where output depends on the date.
2. **Act** through user events: click, type, and the keyboard path, which keyboard and screen-reader users take.
3. **Assert** what the user and the consumer observe: role, accessible name, text, focus, value, and each callback with its literal arguments.
4. **Capture** the final state to `component-artifacts/<component>/<state>.png` for review.
5. **Prove it.** Run the red check from `docs/falsifiable-tests.md`, then run the file three times in a row (`test:components "<component>"` with the runner's repeat option). Done when the test has been seen red and the repeated run passes with zero retries.

## Reliability rules

- **Locate by role**, label, or visible text; add a test id only where no accessible name exists.
- **Retrying assertions** wait for the state to arrive. Every wait is on a condition.
- **Data comes from props or fixtures.** A component that fetches gets its network calls stubbed at the boundary, per `docs/hermetic-dependencies.md`.
- **A fixed viewport**, with fonts loaded before each capture and animations off, except in a test about the animation.
- **Retries stay at 0.** A flaky test is a bug in the test or the component.

The screenshots show a reviewer the state; the assertions are what prove it. A pull request's evidence follows `docs/pull-requests.md`.
