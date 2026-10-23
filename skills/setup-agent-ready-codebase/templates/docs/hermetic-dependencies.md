# Hermetic dependencies

A **hermetic** suite brings up everything it depends on, runs, and tears it down, inside the test process. The bar: from a fresh clone with only Docker running, every test command goes green.

## Substitution ladder

For each dependency, take the highest rung that exists:

1. **The real thing in a container**, started by the container tool in `docs/stack.md`: databases, caches, brokers, search engines. Use the tool's module for the language.
2. **An emulator.** A stateful emulator of the SaaS API (identity providers, payments, email, chat, source hosting), started in-process or in a container. The best ones serve OAuth, OIDC discovery, and signed ID tokens, so sign-in flows run for real. Cloud providers run on a cloud emulator, and other services on their own emulator (SMTP, object storage, mobile backends).
3. **A custom emulator** for a stateful third-party API no emulator covers: routes and state modelled on the provider's documented behaviour, including its error replies.
4. **A network-boundary stub** for a stateless call (a lookup, a webhook receiver's reply), returning payloads copied from the provider's documented responses.
5. **An in-process mock**, only for a seam you own whose real implementation is the subject of a different test.

Start each emulator on port 0 in global setup, seed it with the users the tests need, and hand its URL to the app as config. The app reads its provider base URL from config, so production code has no test branch. Reset state between tests when tests share an instance. A provider no emulator covers, such as an ID token issuer, gets a dev-only seam that keeps the flow real: a key pair generated per run that the server trusts in place of the provider's published keys. Each seam switches on only behind a dev flag, and the server refuses to start with that flag in production.

Code you own sits on rung 1 or 2: your own repositories, services, and queues run for real. A test that mocks your own database layer to test your own handler proves only that the mock was configured.

## Container rules

- Bind to random host ports and read them back from the container object. Fixed host ports collide across worktrees and parallel runs.
- Pin image tags to a version (`postgres:17-alpine`) so runs repeat.
- Start containers once per run in the runner's global setup and pass connection details to tests through the runner's context channel (provide/inject, session-scoped fixtures). Per-test isolation is in `docs/testing.md`.
- Keep container reuse off. Reuse keys on the container config, so two worktrees with identical config share one container and corrupt each other's data.
- A multi-service stack that already has a Compose file starts through the container tool's Compose support, under a project name unique to the run and with host ports from env. The tool's reaper then removes the containers, network, and volumes even when the run is killed.
- Processes the setup spawns (the app server, an emulator, a driver) are killed in teardown, which runs on failure too. Setup refuses to adopt a port, container, or device it did not start, and names the leftover instead.
- For fast iteration, an opt-in env var (`E2E_KEEP_STACK=1`) leaves the stack up and prints the command that removes it. The default run still starts from scratch.
- The container tool finds Docker through `DOCKER_HOST` or its own properties file; alternative Docker runtimes need one of those set. When Docker is unreachable, let the suite fail loudly; a suite that skips itself reads as green.

## Cloud emulation

A cloud emulator serves the provider's API on one endpoint, in a container with a pinned tag from the registry.

- The emulator is the same everywhere: tests, Compose, CI. A project on a different emulator moves over by swapping the image, dropping any account token, and keeping the endpoint, port, and health path.
- SDKs honour an endpoint override from env, so production code needs no test branch. Object-storage clients may additionally need path-style addressing; expose it as config the app reads. Hand the app dummy credentials and a region.
- Services the emulator backs with real containers (functions, managed databases) need the Docker socket mounted into it, as root. Add it only when the code uses those services.
- Create buckets, queues, and tables in global setup through the same SDK the app uses, so the resource definitions match production's infrastructure code.

## Configuration

Tests build the app's config from container details at runtime. A committed `.env.test` holds only non-secret defaults; the developer's `.env` stays out of the test path, so a test run never touches a real account.
