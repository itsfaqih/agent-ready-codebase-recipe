import { defineConfig } from "astro/config";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

export default defineConfig({
  site: "https://agent-ready.itsfaqih.dev",
  srcDir: "./site/src",
  publicDir: "./site/public",
  outDir: "./site/dist",
  vite: { plugins: [vanillaExtractPlugin()] },
});
