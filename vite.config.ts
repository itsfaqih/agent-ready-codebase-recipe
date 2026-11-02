import { defineConfig } from "vite-plus";

// Tests run from vitest.config.ts: it loads Astro's plugins, which every vp lint and vp fmt run would otherwise pay for.
export default defineConfig({
  fmt: {
    printWidth: 120,
    sortPackageJson: false,
    associations: [
      { files: ["*.astro"], language: "astro" },
      // Oxfmt has no XML formatter; its HTML formatter keeps SVG markup intact (renders compared byte for byte).
      { files: ["*.svg"], language: "html" },
    ],
    overrides: [
      {
        // Each paragraph stays on one line (proseWrap "never"), so in Markdown printWidth only decides table
        // alignment. A narrow width keeps tables compact, which keeps the docs agents load small.
        files: ["*.md"],
        options: { proseWrap: "never", printWidth: 40 },
      },
    ],
    ignorePatterns: ["pnpm-lock.yaml", "landing/", "site/dist/", ".astro/", ".claude/", "tools/oxlint/anti-slop/"],
  },
  lint: {
    plugins: ["typescript", "unicorn", "oxc", "import", "vitest"],
    categories: {
      correctness: "error",
      suspicious: "error",
    },
    ignorePatterns: [
      ".agent/**",
      ".agents/**",
      ".claude/**",
      ".codex/**",
      ".cursor/**",
      "landing/**",
      "site/dist/**",
      ".astro/**",
      "tools/oxlint/anti-slop/**",
    ],
    jsPlugins: [
      {
        name: "anti-slop",
        specifier: "./tools/oxlint/anti-slop/index.ts",
      },
      {
        name: "vite-plus",
        specifier: "vite-plus/oxlint-plugin",
      },
    ],
    rules: {
      "typescript/no-explicit-any": "error",
      "typescript/no-unsafe-assignment": "error",
      "typescript/no-unsafe-member-access": "error",
      "typescript/no-unsafe-call": "error",
      "typescript/no-unsafe-return": "error",
      "typescript/no-unsafe-argument": "error",
      "typescript/no-unsafe-type-assertion": "error",
      "typescript/switch-exhaustiveness-check": "error",
      "typescript/no-floating-promises": "error",
      "vitest/expect-expect": "error",
      "vitest/no-conditional-expect": "error",
      "vitest/no-standalone-expect": "error",
      "vitest/no-identical-title": "error",
      "vitest/valid-expect": "error",
      "vitest/no-focused-tests": "error",
      "oxc/no-accumulating-spread": "error",
      "anti-slop/no-array-filter-map": "error",
      "anti-slop/no-reduce-accumulator-copy": "error",
      "anti-slop/no-chained-type-assertions": "error",
      "anti-slop/no-conditional-empty-object-spread": "error",
      "anti-slop/no-known-value-widening": "error",
      "anti-slop/no-module-mocking": "error",
      "anti-slop/no-object-parameters": "error",
      "anti-slop/no-reflect-apply": "error",
      "anti-slop/no-reflect-get": "error",
      "anti-slop/no-runtime-typeof": "error",
      "anti-slop/no-shape-in-symbol-names": "error",
      "anti-slop/no-unknown-parameters": "error",
      "anti-slop/no-unknown-returns": "error",
      "anti-slop/no-unknown-type-aliases": "error",
      "anti-slop/no-unsafe-dictionary-type": "error",
      "anti-slop/no-widen-then-assert": "error",
      "anti-slop/require-readable-spacing": "error",
      "anti-slop/require-safety-comment-for-type-assertion": "error",
      "import/no-unassigned-import": [
        "error",
        {
          allow: ["**/*.css"],
        },
      ],
      "vite-plus/prefer-vite-plus-imports": "error",
    },
    // Type-aware rules only; tsrs (lint:tsrs) owns type checking.
    options: {
      typeAware: true,
    },
  },
});
