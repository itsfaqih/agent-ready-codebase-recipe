# Agent access (one-time setup)

The fixes are in `docs/agent-access.md`; this file finds the blockers and proves the result.

1. **List the blockers.** Start the app and walk every flow with the agent browser driver in `docs/stack.md`, signed out and as each role, and read the auth, payment, messaging, and env-config code. Record each blocker with where it occurs and what it needs. Done when every route has been walked to its outcome or stopped at a recorded blocker.
2. **Remove each blocker** with the fix for its kind in `docs/agent-access.md`. Done when every recorded blocker has a fix.
3. **Prove it with a spec.** Encode the walk as the agent-access spec that `docs/agent-access.md` describes. Done when it passes from a fresh worktree after `setup`, with no step left to an agent's judgment.
