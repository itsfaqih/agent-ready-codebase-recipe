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
- The hero demo is `site/src/components/RunDemo.astro`, played by `site/src/components/run-demo.ts`. Change its framing or motion by the steps in `site/src/components/REHEARSAL.md`.
- The page's faux screens are the problem rows (`ProblemPicture.astro`), the run steps (`RunSteps.astro`) and the docs figure (`DocsFigure.astro`), all built from the parts in `site/src/components/Screen.css.ts`; their captions and strings live in `site/src/data/content.ts`. Each screen runs off its tile on the right and bottom, so `test:layout` fails when a line of text reaches the cut or sits under a window marked `data-overlay`. Lines that carry `data-print` print in order once their section is in view.
- Colors come from `vars.color` in `site/src/styles/theme.css.ts`, which holds a light and a dark value for each token; the page follows the visitor's `prefers-color-scheme`. A terminal's ground is `terminal`, not `ink`, because ink turns light in dark mode; the terminal stays the darkest thing on screen in both schemes (black in dark). On dark, faux windows get depth from lighter surfaces and the one `brightHairline` in `site/src/components/Screen.css.ts`, not from shadows or double edges. `test:layout` also runs `tools/layout/contrast.ts`, which fails when any visible text in either scheme falls below WCAG contrast against what is painted beneath it; text that is dim on purpose gets its minimum in that script's `dim` table.
- The nav's theme switch (`site/src/components/ThemeSwitch.astro`) stores the visitor's choice under the key in `site/src/styles/scheme.ts`, and the head script in `site/src/layouts/Base.astro` copies it to `data-theme` on `<html>` before the first paint; with nothing stored the page follows the system. Style an element per scheme with `whenDark` from `scheme.ts`, never a bare `prefers-color-scheme` query, which ignores the choice. `test:layout` runs `tools/layout/theme-switch.ts`, which fails when the switch, the stored choice or the first frame after a reload shows the wrong scheme.
- Sections enter through `site/src/components/sections.ts` and the entrance rules at the end of `site/src/styles/page.css.ts`. To make an element enter, give it `data-reveal` inside its section's `data-reveal-group`.
- The share image and video (`site/public/og.png`, `og.mp4`, `og.webm`) are filmed from `site/src/pages/og.astro` by `vp run og <preview-url>`, against a built and previewed site. Re-film them after changing the hero title, the skill command or the run.
- The skill's `metadata.version` rises once per change that reaches `origin/main`; `lint:skill-version` fails otherwise and names the level to raise. In a clone that has run `vp config --hooks --no-agent`, a commit or merge on `main` copies the skill to `~/.agents/skills/`.
- `skills check` and `skills update` reinstall every global skill with an upstream change and drop local edits to it; install this skill with `skill:sync`.
