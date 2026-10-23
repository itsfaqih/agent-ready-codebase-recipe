# Lint config (one-time setup)

The rules live in `docs/lint.md`; this file builds the machinery from the linter, formatter, and type checker recorded in `docs/stack.md`.

1. **Inventory file types.** List every language and config format in the repo (`git ls-files | sed 's/.*\.//' | sort | uniq -c`), including extensionless ones (a `Dockerfile`, a script found by its shebang). Done when the survey notes list every file type, each with its tools or a reason it stays unchecked.
2. **Wire the commands.** Give each file type a check script `lint:<type>` (warnings fail) and a fix script `lint:<type>:fix`, in the scripts or task runner the project already uses, per package in a monorepo. Run every check in CI, and on staged files in a pre-commit hook when the project uses hooks. Done when every file type from step 1 has both scripts.
3. **Move a replaced tool over.** When stage 2 swapped one tool for another, migrate settings with the new tool's migration command where it has one, port the remaining rules by hand (keep each rule the new tool implements), and delete the old configs and dependencies. Done when the old tool appears in no config, lockfile, script, or CI step.
4. **Add the project rules.** Configure these in the linter, each at error level:
   - **Unsafe types.** No explicit `any`, no unsafe assignment, member access, call, return, argument, or type assertion; exhaustive `switch` over unions. These enforce `docs/boundaries.md`.
   - **Test rules.** Every test has an assertion; no conditional or standalone assertion; no duplicate title; no fixed waits; no forced clicks; every async assertion awaited. Scope the e2e rule set to the e2e directory.
   - **Strictness accepted in stage 2.** The strict compiler settings in the type checker's config, and the low-evidence rule pack with every rule it ships, including its rule against module mocking, which enforces the substitution ladder in `docs/hermetic-dependencies.md`.
   - **No console.** `console.*` fails in source directories once `docs/observability.md` installs the logger.
5. **Get to green.** Run every fix command, then fix the rest at the root. Done when every check command exits 0 on the whole tree and each rule above has a fixture line that makes it fail, seen red and reverted.

When the type checker's results flip between runs, gate on the reference compiler until it stabilises, and note the flipping file in the report.
