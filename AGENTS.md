# Agent instructions

Every check here is a command with a deterministic verdict. A check done by hand (an app walk, a curl, reading output) becomes a test, script, or lint rule before the work is called done.

## Read a doc when

- **Stack**: you pick or swap a tool → `docs/stack.md`
- **Worktrees**: you add a port, path, or env var → `docs/worktrees.md`
- **Lint**: you add a file type or hit a lint finding → `docs/lint.md`
- **Falsifiable tests**: you write or review any test, or fix a bug → `docs/falsifiable-tests.md`
- **Component tests**: you add or change a component or one of its states → `docs/component-tests.md`
- **App use**: you interact with the running site directly → `docs/app-use.md`
- **Screenshots**: you capture an image for a PR or report → `docs/screenshots.md`
- **Pull request**: you open or update a PR → `docs/pull-requests.md`
- **Lessons**: you make the same mistake twice (the user corrects it twice, or a fix undoes earlier work) → `docs/lessons.md`

## Project facts

- Dev URLs: `https://agent-ready-codebase-recipe.localhost`, with the branch name prepended as a subdomain in a linked worktree.
- Tool guides: the agent-browser skill, installed by pnpm into `.claude/skills/`, and the Vite+ guide in `node_modules/vite-plus/AGENTS.md`.
- Run package scripts with `vp run <script>`. The built-in `vp dev` and `vp build` start plain Vite, without Astro.
- The skill itself lives in `skills/setup-agent-ready-codebase/`; `tools/screenshots/annotate.js` is a copy of its template, and `lint:template-sync` fails when the two differ.
- The skill's `metadata.version` rises once per change that reaches `origin/main`; `lint:skill-version` fails otherwise and names the level to raise. In a clone that has run `vp config --hooks --no-agent`, a commit or merge on `main` copies the skill to `~/.agents/skills/`.
- `skills check` and `skills update` reinstall every global skill with an upstream change and drop local edits to it; install this skill with `skill:sync`.
