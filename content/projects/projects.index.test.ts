import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { getProjectBySlug } from "@/app/(site)/projects/_lib/getProjectBySlug";
import { getProjects } from "@/app/(site)/projects/_lib/getProjects";
import { PROJECTS as STABLE_PROJECTS } from "@/app/(site)/projects/_lib/projects.data";
import { SKILL_IDS } from "@/content/skills/skills.index";
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

const COUNCIL_SLUG = "council-digital-platforms-mini-lab";

const MOCK_SLUGS = [
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

test("adds Council first while preserving all twelve mock fixtures", () => {
  expect(PROJECTS).toHaveLength(13);
  expect(PROJECTS.map((project) => project.slug)).toEqual([
    COUNCIL_SLUG,
    ...MOCK_SLUGS,
  ]);
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
    false,
  ]);
  expect(PROJECT_CONTENT.map((project) => project.order)).toEqual(
    Array.from({ length: 13 }, (_, index) => index + 1),
  );
  const mockProjects = PROJECTS.filter((project) => project.slug !== COUNCIL_SLUG);
  expect(mockProjects.map((project) => project.slug)).toEqual(MOCK_SLUGS);
  const mockParityProjection = mockProjects.map((project) =>
    project.slug === "nextjs-ecommerce-platform"
      ? { ...project, featured: true }
      : project,
  );
  expect(
    createHash("sha256")
      .update(JSON.stringify(mockParityProjection))
      .digest("hex"),
  ).toBe(LEGACY_PROJECTS_SHA256);
  expect(PROJECTS.filter((project) => project.featured).map((project) => project.slug)).toEqual([
    COUNCIL_SLUG,
    "seo-portfolio-platform",
  ]);
  expect(PROJECTS.filter((project) => !project.featured)).toHaveLength(11);
  expect(PROJECTS.filter((project) => !project.featured)[0]?.slug).toBe(
    "nextjs-ecommerce-platform",
  );
});

test("registers Council with only approved skill evidence and no public links", () => {
  const council = PROJECT_CONTENT.find(
    (project) => project.slug === COUNCIL_SLUG,
  );

  expect(council).toMatchObject({
    id: 13,
    featured: true,
    order: 1,
    title: "Council Digital Platforms Mini Lab",
    links: { live: null, github: null },
    media: { cover: null, gallery: [] },
    seo: {
      title: "Council Digital Platforms Mini Lab",
      description:
        "A council-style digital-service prototype using Drupal Webform, conditional logic, PHP postcode validation and structured JSON data.",
    },
  });
  expect(council?.skillIds.every((skillId) => SKILL_IDS.has(skillId))).toBe(
    true,
  );
  expect(council?.skillIds).not.toContain("twig");
  expect(council?.technologies).not.toContain("Twig");
  expect(council?.caseStudy.technicalImplementation).not.toContain("Twig");
  expect(PROJECTS[0]).toMatchObject({
    slug: COUNCIL_SLUG,
    links: {},
    images: [],
  });
});

test("keeps every project consumer on the same normalized objects", async () => {
  expect(STABLE_PROJECTS).toBe(PROJECTS);
  await expect(getProjects()).resolves.toBe(PROJECTS);
  await expect(getProjectBySlug(COUNCIL_SLUG)).resolves.toBe(PROJECTS[0]);
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

  expect(runtimeJsonFiles).toHaveLength(13);
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
