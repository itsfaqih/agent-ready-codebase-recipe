# Falsifiable tests

A test earns its place by being **falsifiable**: some plausible bug in the code under test turns it red. A **tautological** test passes whatever the code does, so it buys confidence it has not earned.

## Shapes of tautology

Hunt each of these in every test you write or review:

- **Mock echo**: the assertion checks a value the test itself stubbed, or only checks that a mock was called.
- **Mirrored oracle**: the expected value is computed with the same logic as the implementation (or by calling it). Write the expected value as a literal, worked out from the spec.
- **Rubber-stamp snapshot**: a snapshot accepted on first run without reading it. A snapshot is falsifiable only after a human or agent has checked its content against the spec.
- **Vacuous assertion**: "is defined", "is truthy", "does not throw", or a status-only check on something that holds regardless of correctness. Assert on the content.
- **Unreached assertion**: `expect` inside a `catch`, a callback, or a conditional that may never run; a test with no assertions at all.
- **Framework test**: the test exercises the library or language (an ORM saves a row, `map` maps) rather than the project's own logic.
- **Smoke-only e2e**: a flow test that checks the page loaded and never checks the outcome the user came for.

## The red check

For each test you write or keep, prove it can fail:

1. Break the behaviour it names in the implementation: flip the condition, return early, change the constant, drop the write.
2. Run that test. It goes **red**, and the failure message points at the behaviour.
3. Revert the break and see it green.

For a bug fix, the unfixed code is the break. Write the test first, see it red for the reported reason, then fix.

A test that stays green under the break is tautological: rewrite it against the observable outcome, then repeat the check. For a whole suite, a mutation tester automates the same check; surviving mutants list the tests to strengthen.

Done when every new or modified test has been seen red against a deliberate break, and the break is reverted. When you report the work, list each changed behaviour that no test exercises as untested.
