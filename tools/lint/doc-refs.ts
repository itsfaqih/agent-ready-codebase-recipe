import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const skill = "skills/setup-agent-ready-codebase";

const markdownIn = (dir: string) =>
  readdirSync(dir, { recursive: true, encoding: "utf8" })
    .filter((file) => file.endsWith(".md"))
    .map((file) => join(dir, file));

const scopes = [
  { docs: "docs", sources: ["AGENTS.md", ...markdownIn("docs")], reference: /\bdocs\/([a-z0-9-]+\.md)/gu },
  {
    docs: `${skill}/templates/docs`,
    sources: [`${skill}/SKILL.md`, ...markdownIn(`${skill}/references`), ...markdownIn(`${skill}/templates`)],
    reference: /\bdocs\/([a-z0-9-]+\.md)/gu,
  },
  { docs: `${skill}/templates/docs`, sources: ["README.md"], reference: /^\| `([a-z0-9-]+\.md)` \|/gmu },
];

const broken = scopes.flatMap(({ docs, sources, reference }) =>
  sources.flatMap((source) =>
    readFileSync(source, "utf8")
      .matchAll(reference)
      .map((match) => match[1] ?? "")
      .filter((file) => !existsSync(join(docs, file)))
      .map((file) => `${source} points at ${file}, which is not in ${docs}`)
      .toArray(),
  ),
);

if (broken.length > 0) {
  console.error([...new Set(broken)].join("\n"));
  process.exit(1);
}

console.log("Every doc pointer names an existing doc");
