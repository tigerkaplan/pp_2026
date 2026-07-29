import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { getProjectBySlug } from "@/app/(site)/projects/_lib/getProjectBySlug";
import { getProjects } from "@/app/(site)/projects/_lib/getProjects";
import { PROJECTS as STABLE_PROJECTS } from "@/app/(site)/projects/_lib/projects.data";
import sourceProject from "./seo-portfolio-platform.json";
import {
  normaliseProjectContent,
  PROJECT_CONTENT,
  PROJECTS,
} from "./projects.index";
import type { ProjectRegistration } from "./project-content";
import {
  validateProjectContent,
  validateProjectRegistry,
} from "./validate-projects";

const EXPECTED_SLUGS = [
  "seo-portfolio-platform",
  "nextjs-ecommerce-platform",
  "inventory-management-api",
  "seo-optimization-dashboard",
  "content-management-system",
  "authentication-service",
  "performance-monitoring-dashboard",
  "web-scraper-api",
  "elearning-platform",
  "task-management-app",
  "blog-platform",
  "api-integration-service",
];

const LEGACY_PROJECTS_SHA256 =
  "719d5e989440909ac0074c9750bf1b03c0ad387695e6b5dbc95bb8cfed53c978";

function cloneSource(): Record<string, unknown> {
  return JSON.parse(JSON.stringify(sourceProject)) as Record<string, unknown>;
}

function registration(
  content: unknown,
  source = "content/projects/test-project.json",
): ProjectRegistration {
  return { source, content };
}

test("preserves all twelve legacy fixtures with exact semantic parity", () => {
  expect(PROJECTS).toHaveLength(12);
  expect(PROJECTS.map((project) => project.slug)).toEqual(EXPECTED_SLUGS);
  expect(PROJECTS.map((project) => project.featured)).toEqual([
    true,
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  expect(PROJECT_CONTENT.map((project) => project.order)).toEqual([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
  ]);
  expect(
    createHash("sha256").update(JSON.stringify(PROJECTS)).digest("hex"),
  ).toBe(LEGACY_PROJECTS_SHA256);
});

test("keeps every project consumer on the same normalized objects", async () => {
  expect(STABLE_PROJECTS).toBe(PROJECTS);
  await expect(getProjects()).resolves.toBe(PROJECTS);
  await expect(getProjectBySlug(EXPECTED_SLUGS[0])).resolves.toBe(PROJECTS[0]);
});

test("rejects missing required fields and unknown skill IDs", () => {
  const missingSummary = cloneSource();
  (missingSummary.card as Record<string, unknown>).summary = "";
  expect(() =>
    validateProjectContent(missingSummary, "missing-summary.json", new Set()),
  ).toThrow("summary must be a non-empty string");

  const unknownSkill = cloneSource();
  unknownSkill.skillIds = ["unregistered-skill"];
  expect(() =>
    validateProjectContent(unknownSkill, "unknown-skill.json", new Set()),
  ).toThrow('unknown skillId "unregistered-skill"');
});

test("rejects duplicate IDs, slugs and display orders", () => {
  const first = cloneSource();
  const duplicate = cloneSource();

  expect(() =>
    validateProjectRegistry(
      [registration(first), registration(duplicate, "duplicate.json")],
      new Set(),
    ),
  ).toThrow("Duplicate project id");

  duplicate.id = 99;
  expect(() =>
    validateProjectRegistry(
      [registration(first), registration(duplicate, "duplicate.json")],
      new Set(),
    ),
  ).toThrow("Duplicate project slug");

  duplicate.slug = "different-slug";
  expect(() =>
    validateProjectRegistry(
      [registration(first), registration(duplicate, "duplicate.json")],
      new Set(),
    ),
  ).toThrow("Duplicate project order");
});

test("rejects invalid links, media, display combinations and templates", () => {
  const invalidLink = cloneSource();
  (invalidLink.links as Record<string, unknown>).live = "javascript:alert(1)";
  expect(() =>
    validateProjectContent(invalidLink, "invalid-link.json", new Set()),
  ).toThrow("must use http or https");

  const invalidMedia = cloneSource();
  (invalidMedia.media as Record<string, unknown>).cover = "relative/image.jpg";
  expect(() =>
    validateProjectContent(invalidMedia, "invalid-media.json", new Set()),
  ).toThrow("media.cover");

  const invalidDisplay = cloneSource();
  invalidDisplay.links = { live: null, github: null };
  invalidDisplay.display = {
    showLiveLink: false,
    showGithubLink: false,
    showPreview: false,
    showFullProject: false,
  };
  expect(() =>
    validateProjectContent(invalidDisplay, "invalid-display.json", new Set()),
  ).toThrow("a featured project must expose Preview or full project");

  expect(() =>
    validateProjectContent(
      cloneSource(),
      "content/templates/project.template.json",
      new Set(),
    ),
  ).toThrow("template must not be registered");
});

test("normalizes optional links and missing cover media without placeholders", () => {
  const content = cloneSource();
  content.links = { live: null, github: null };
  content.media = { cover: null, coverAlt: "", gallery: [] };
  content.display = {
    showLiveLink: false,
    showGithubLink: false,
    showPreview: true,
    showFullProject: true,
  };
  const validated = validateProjectContent(
    content,
    "optional-content.json",
    new Set(),
  );

  expect(normaliseProjectContent(validated)).toMatchObject({
    links: {},
    images: [],
  });
});

test("keeps templates out of runtime registries and future additions at the data boundary", () => {
  const projectDirectory = path.join(process.cwd(), "content", "projects");
  const runtimeJsonFiles = readdirSync(projectDirectory).filter((file) =>
    file.endsWith(".json"),
  );
  const templateDirectory = path.join(process.cwd(), "content", "templates");

  expect(runtimeJsonFiles).toHaveLength(12);
  expect(runtimeJsonFiles.some((file) => file.includes(".template."))).toBe(
    false,
  );
  expect(
    readdirSync(templateDirectory)
      .filter((file) => file.endsWith(".template.json"))
      .sort(),
  ).toEqual(["project.template.json", "skill.template.json"]);

  const componentDirectory = path.join(
    process.cwd(),
    "app",
    "(site)",
    "projects",
    "_components",
  );
  const componentSources = readdirSync(componentDirectory)
    .filter((file) => file.endsWith(".tsx"))
    .map((file) => readFileSync(path.join(componentDirectory, file), "utf8"))
    .join("\n");
  expect(componentSources).not.toContain("content/projects");

  const futureContent = validateProjectContent(
    cloneSource(),
    "future-project.json",
    new Set(),
  );
  expect(normaliseProjectContent(futureContent)).toEqual(
    expect.objectContaining({
      slug: futureContent.slug,
      title: futureContent.title,
      summary: futureContent.card.summary,
    }),
  );
});
