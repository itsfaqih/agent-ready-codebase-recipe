# Integration harness (one-time setup)

How to write tests is `docs/testing.md`; dependencies are `docs/hermetic-dependencies.md`. This file states what the runner must do. The runner and container tool are the ones recorded in `docs/stack.md`.

A project with tests already keeps their layout: point the runner's file patterns at where its unit and integration tests live, and rename or move a file only to tell the two apart.

The harness holds when:

- **Two runner projects.** Unit and integration tests run as the two projects and scripts in `docs/testing.md`. Integration files match a naming pattern (`*.int.test.*`) and get a longer timeout.
- **Global setup** starts the dependencies per the container rules in `docs/hermetic-dependencies.md`, runs migrations, and hands tests their connection details through the runner's context channel.
- **Isolation is available.** A per-worker database created from a migrated template, or a transaction rolled back after each test, so `docs/testing.md` step 2 has something to build on.

Done when the empty integration suite starts and stops every container with one command, and the container list is empty afterwards.
