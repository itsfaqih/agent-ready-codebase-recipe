import { defineConfig } from "astro/config";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

export default defineConfig({
  site: "https://github.com/itsfaqih/agent-ready-codebase-recipe",
  srcDir: "./site/src",
  publicDir: "./site/public",
  outDir: "./site/dist",
  vite: { plugins: [vanillaExtractPlugin()] },
});
