import { builtinEnvironments, type Environment } from "vite-plus/test/runtime";

// happy-dom's globals, but with Vite's SSR transform: Astro compiles a .astro import into a renderable component only
// for SSR, and the stock happy-dom environment switches to the client transform.
const astroDom: Environment = { ...builtinEnvironments["happy-dom"], name: "astro-dom", viteEnvironment: "ssr" };

export default astroDom;
