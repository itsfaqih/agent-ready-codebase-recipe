# Lint

Every file type in the repo has a check script, `lint:<type>` (`lint:ts`, `lint:sh`, `lint:yaml`), that exits non-zero on any finding (warnings fail), and a fix script, `lint:<type>:fix`, that runs its autofixer.

After each batch of edits, run the check for every file type you touched, before running tests.

## Coverage

Each file type has one linter, one formatter, and (for typed languages) one type checker, recorded in `docs/stack.md`. A file type with no tool gets one, and its two scripts, when it is added to the repo, including the easy-to-forget ones: shell scripts, Dockerfiles, CI workflows, SQL, Markdown.

## Findings

Fix a finding at its root. Rules and strict compiler settings stay at their level; turning one down needs the user's approval and a comment in config giving the reason. A single justified exception gets an inline disable with its reason on the same line.

When an agent repeats a mistake a rule can detect, encode it as a lint rule (a config option, a restricted-import entry, or a custom rule) through `docs/lessons.md`.

The test rules catch the mechanical subset of `docs/falsifiable-tests.md`: no assertion, conditional or standalone assertion, fixed waits, forced clicks, missing awaits. Run the checks before the red check.
