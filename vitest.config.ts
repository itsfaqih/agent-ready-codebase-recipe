/// <reference types="vite-plus" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    environment: "./site/test/astro-dom.ts",
    // Each test imports and runs a component's client module itself, so the <script> tag in the rendered markup
    // stays unloaded.
    environmentOptions: { happyDOM: { settings: { handleDisabledFileLoadingAsSuccess: true } } },
    include: ["site/src/**/*.test.ts"],
    sequence: { shuffle: true },
  },
});
