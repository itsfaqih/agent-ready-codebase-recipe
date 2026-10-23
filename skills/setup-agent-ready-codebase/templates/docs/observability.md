# Observability

Two questions, two tools. **Wide events** answer "what happened to this request?" for debugging and business queries. **Product analytics** answers "what do visitors do?" for pageviews and product events. The tools are the logging library, log store, and analytics tool in `docs/stack.md`.

A project at light depth (one service, little traffic) keeps the Wide events section and writes its events to stdout. The sections marked full depth add a queryable log store and product analytics for a project that needs them.

## Wide events

A **wide event** (canonical log line) is one structured event per request per service, enriched by handlers as context becomes known and emitted once when the request ends, so success and failure both produce it.

1. **Install and wire.** Install the logging library, register it with the framework's middleware, and run its own diagnostic if it has one. Done when a request to any route emits one event.
2. **One emitter.** Handlers reach the request logger the framework integration provides and add context to it; failures go through the library's structured error with a message, status, cause, and fix. A lint rule forbids `console.*` over source directories (`docs/lint.md`), so a stray print fails the lint check. Done when the lint check reports no `console.*` call in source directories.
3. **Wide and high-cardinality.** The event carries every field the request has: the user (id, plan, account age), the business context (cart, order, coupon), each dependency call (provider, latency, attempt), and active feature flags, beside the request id, method, path, status, duration, and error. Declare the field names once as typed fields, so a typo fails the type check. Done when the event for every route holds the user and the route's business ids.
4. **Redact.** Mask emails, card numbers, IPs, and tokens before output and before any drain, with the library's redaction. Done when the event for a request carrying each of them shows it masked.
5. **Prove it.**
   - An integration test per route boots the app with a capturing drain (a function that pushes each event to an array), sends one request, and asserts exactly one event with the required fields. A thrown error still yields its event.
   - When the logging library ships a pattern scorer, run it in CI as a floor on entry points, with the library's version pinned so a rule change cannot move the score. Done when it passes locally.

## Log store and sampling (full depth)

An agent in any worktree answers "what happened to this request?" with a query against the log store.

1. **Tail sampling.** Keep every error and every request slower than the p99 threshold, and 1-5% of the rest. Add a keep rule for priority users and requests under a debugged flag. Done when an error request and a slow request are kept on every run.
2. **Ship to the log store.** Wire the library's drain to the store's endpoint, read from env. Index only low-cardinality labels (service, environment, level); the request id, user, and every other field stay in the event body, queried with the store's JSON filter.
3. **A local stack per worktree.** The dev compose file runs the log store and its viewer with ports published per `docs/worktrees.md`. `setup` writes the mapped endpoint into `.env`. Production points the same env vars at the hosted or self-hosted store.
4. **Prove it.** An `observability` script starts the stack, sends a request, and queries the store's API for that request's id. Done when the query returns the event with its user and business fields, and the instructions file has a line for the query command.

## Product analytics (full depth)

1. **Self-hosted per environment.** The analytics tool runs in dev compose with its own database and ports published per `docs/worktrees.md`. Its first start creates a default admin: seed a fixed local password in dev, and change it before any deployed instance is reachable.
2. **Tracker off by default.** The page renders the tracker script only when both the analytics URL and the website id are set in env. `.env.example` leaves them empty, so agent, e2e, and worktree traffic never reaches analytics, and a production-hostname allowlist keeps staging out of production numbers.
3. **Typed events.** One `analytics` module exports the event names as constants (within the tool's length limit) and a `track(name, data)` that calls the tracker when it is loaded and does nothing otherwise. Event data holds only numbers, ids, and enums. Wide events carry the user's identity; analytics stays anonymous.
4. **Prove it.** An e2e spec sets both env vars, performs each tracked flow, and asserts the request to the analytics collect endpoint with the flow's event name; a second spec with the vars unset asserts the script tag is absent. Done when both pass in a fresh worktree.
