# Upstream

- Source: the `install-anti-slop` skill's bundled copy at `~/.agents/skills/install-anti-slop/assets/anti-slop`, copied by its `scripts/install.mjs`.
- Source revision: unknown. The skill directory is not a git checkout, so no commit identifies the copied files.
- Installed paths: `tools/oxlint/anti-slop/` (entry point `index.ts`), loaded through `lint.jsPlugins` in `vite.config.ts`.
- Deviations: the rules import `defineRule` and `eslintCompatPlugin` from `vite-plus/lint/plugins`, the Vite+ re-export of `@oxlint/plugins`, instead of `@oxlint/plugins`. Every rule runs at `error` in `vite.config.ts`.
