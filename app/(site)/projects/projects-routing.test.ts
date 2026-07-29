import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

const projectsRoot = path.join(process.cwd(), "app", "(site)", "projects");
const interceptedRoute = path.join(
  projectsRoot,
  "@modal",
  "(.)[slug]",
  "page.tsx",
);

function collectDirectories(root: string): string[] {
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    if (!entry.isDirectory()) return [];
    const absolute = path.join(root, entry.name);
    return [absolute, ...collectDirectories(absolute)];
  });
}

test("keeps the project modal in the same-level intercepted route", () => {
  expect(existsSync(path.join(projectsRoot, "layout.tsx"))).toBe(true);
  expect(existsSync(path.join(projectsRoot, "@modal", "default.tsx"))).toBe(true);
  expect(existsSync(interceptedRoute)).toBe(true);
  expect(existsSync(path.join(projectsRoot, "[slug]", "page.tsx"))).toBe(true);
});

test("has exactly one valid project interception marker", () => {
  const interceptionDirectories = collectDirectories(projectsRoot)
    .map((directory) => path.relative(projectsRoot, directory))
    .filter((directory) =>
      directory
        .split(path.sep)
        .some((segment) => segment.startsWith("(.")),
    );

  expect(interceptionDirectories).toEqual([
    path.join("@modal", "(.)[slug]"),
  ]);
});
