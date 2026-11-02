// oxlint's type-aware pass runs plain TypeScript, which cannot read .astro files; astro check resolves the real ones.
declare module "*.astro" {
  import type { AstroComponentFactory } from "astro/runtime/server/index.js";

  const Component: AstroComponentFactory;
  export default Component;
}
