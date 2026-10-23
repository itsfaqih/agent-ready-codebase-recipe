# Agent access

An agent in a fresh worktree runs `setup` and then `dev` and reaches every screen as every role, with no human, no real account, and no secret. Anything that stops it is a **blocker**: a point where the flow needs a human, a credential the checkout lacks, or a live outside service. When a change adds a blocker (a new auth method, provider, verification step, or env var), remove it in the same change with the fix for its kind:

- **Seeded users.** An idempotent `seed` script, run by `setup`, creates one user per role with fixed, non-secret credentials (`admin@example.test` / `password-admin`), plus the records each role needs to see a non-empty app. List the users in the instructions file.
- **Third-party APIs.** The dev script starts the provider on the `docs/hermetic-dependencies.md` substitution ladder (emulator first, then a custom emulator, then a network stub) on a free port (port 0) and points the app at it through config, with the emulator's seed holding the same users. OAuth and "Sign in with" buttons then complete against the emulator.
- **Messages to the user.** Email and SMS go to an emulator or a local mail catcher. The agent reads the link or code from the emulator's inspector or API.
- **Human-proof checks.** CAPTCHA uses the provider's published test keys, which always pass. 2FA seeds a fixed TOTP secret for the seeded users, listed beside them.
- **Missing keys.** Every env var has a working local default in `.env.example` that points at an emulator; the app starts with no real secret.

Each substitution switches on through config, behind a dev flag the app refuses to start with in production. The agent-access spec (`e2e/agent-access`) proves it: for each seeded user, sign in and reach the role's main screen; for each removed blocker, complete it through its substitute; and a test boots the app with the dev flag in production mode and expects it to exit non-zero. Extend that spec with each new blocker fix.
