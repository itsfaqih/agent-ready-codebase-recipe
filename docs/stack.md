# Stack

The tools this project uses, chosen with the user during setup. The other docs name the job; this table says which tool does it.

| Job | Tool |
| --- | --- |
| Node version and package commands | Vite+ (`vp`) over Node 24 |
| Dependency manager | pnpm 12 (pinned in `packageManager`) |
| Site framework | Astro 7, static output |
| Styling | Vanilla Extract |
| Dev URLs and ports | portless |
| Type checker | tsrs, the Rust port of TypeScript 7, for `.ts`, pinned to an exact version while it is pre-1.0 and run without `--fast`, whose machine-dependent checker count can change diagnostics; `astro check` for `.astro`, run from `tools/astro-check/` with TypeScript 6, because it needs the JavaScript API that TypeScript 7 and tsrs no longer ship. Move it to the root once `@astrojs/check` supports TypeScript 7. |
| Linter | Oxlint through `vp check`, type-aware, with the anti-slop plugin in `tools/oxlint/anti-slop/` |
| Formatter | Oxfmt through `vp check`, with SVG through its HTML formatter |
| Component test runner | Vitest through `vp test`, with happy-dom, rendering through Astro's container API |
| App driver for agents | agent-browser |
| Pull requests | GitHub CLI (`gh`) |
| Git hooks | Vite+ (`vp config`), in `.vite-hooks/` |
| Images and video in the repo | Git LFS, tracked by file extension in `.gitattributes`; `.vite-hooks/pre-push` runs `git lfs pre-push`, because the Vite+ hooks path replaces the hooks LFS installs |
| Hosting | Cloudflare Pages project `agent-ready` (itsfaqih account), connected to GitHub: each push to `main` runs `pnpm run build` and publishes `site/dist` to https://agent-ready.itsfaqih.dev; pull requests get preview links |
| CI | GitHub Actions, with Vite+ set up by `voidzero-dev/setup-vp` |

Rules:

- **New parts start on the chosen tool; an existing part moves over as it is changed.** Where a part cannot move piecemeal (a web framework's routes, a backend's HTTP layer), it keeps its framework and only new projects use the chosen one.
- **One tool per job.** Adding a second tool for a job already in the table needs the user's approval and a row change.
- **Agent guides stay installed.** When a tool ships an agent guide or skill, it is installed, committed with its lockfile, and pointed at from the instructions file, so every worktree has it.
- **Every tool runs offline.** A tool that needs a paid token or a hosted account to run in a worktree is swapped for one that runs offline, and an unmaintained tool for a maintained one.
