import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { getProjectBySlug } from "@/app/(site)/projects/_lib/getProjectBySlug";
import { getProjects } from "@/app/(site)/projects/_lib/getProjects";
import { PROJECTS as STABLE_PROJECTS } from "@/app/(site)/projects/_lib/projects.data";
import { SKILL_IDS } from "@/content/skills/skills.index";
import sourceProject from "./personal-portfolio-2026.json";
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
const PORTFOLIO_SLUG = "personal-portfolio-2026";
const ACTIVE_SLUGS = [COUNCIL_SLUG, PORTFOLIO_SLUG];
const REMOVED_SLUGS = [
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

function cloneSource(): Record<string, unknown> {
  const clone = JSON.parse(JSON.stringify(sourceProject)) as Record<string, unknown>;
  clone.skillIds = [];
  return clone;
}

function registration(
  content: unknown,
  source = "content/projects/test-project.json",
): ProjectRegistration {
  return { source, content };
}

test("keeps exactly the two active project records in registry order", () => {
  expect(PROJECTS).toHaveLength(2);
  expect(PROJECTS.map((project) => project.slug)).toEqual(ACTIVE_SLUGS);
  expect(PROJECTS.map((project) => project.title)).toEqual([
    "Council Digital Platforms Mini Lab",
    "Personal Portfolio 2026",
  ]);
  expect(PROJECTS.map((project) => project.featured)).toEqual([true, true]);
  expect(PROJECT_CONTENT.map((project) => project.order)).toEqual([1, 2]);
  expect(PROJECTS.map((project) => project.id)).toEqual([13, 1]);
  for (const slug of REMOVED_SLUGS) {
    expect(PROJECTS.some((project) => project.slug === slug)).toBe(false);
  }
  expect(PROJECT_CONTENT.filter((project) => project.slug === PORTFOLIO_SLUG)).toEqual([
    expect.objectContaining({
      id: 1,
      title: "Personal Portfolio 2026",
      category: "Personal Product",
      order: 2,
      featured: true,
      card: expect.objectContaining({
        highlights: [
          "Data-driven Project Cards and case studies",
          "Intercepted previews with standalone project routes",
          "Responsive, keyboard-aware interaction patterns",
        ],
      }),
      links: { live: null, github: "https://github.com/tigerkaplan/pp_2026" },
      display: {
        showLiveLink: false,
        showGithubLink: true,
        showPreview: true,
        showFullProject: true,
      },
    }),
  ]);
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

test("keeps every registered media path inside the real public directory", () => {
  const publicDirectory = path.join(process.cwd(), "public");
  const resolveAsset = (assetPath: string) =>
    path.join(publicDirectory, assetPath.replace(/^\/+/, ""));

  for (const project of PROJECT_CONTENT) {
    if (project.media.cover) {
      expect(project.media.cover.startsWith("/")).toBe(true);
      expect(existsSync(resolveAsset(project.media.cover))).toBe(true);
    }
    for (const galleryPath of project.media.gallery) {
      expect(galleryPath.startsWith("/")).toBe(true);
      expect(existsSync(resolveAsset(galleryPath))).toBe(true);
    }
  }

  expect(PROJECT_CONTENT.find((project) => project.slug === COUNCIL_SLUG)?.media).toEqual(
    { cover: null, coverAlt: "", gallery: [] },
  );
  expect(PROJECT_CONTENT.find((project) => project.slug === PORTFOLIO_SLUG)?.media).toEqual(
    {
      cover: null,
      coverAlt: "Personal Portfolio project media is pending approval.",
      gallery: [],
    },
  );
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

  const remoteMedia = cloneSource();
  (remoteMedia.media as Record<string, unknown>).cover = "https://example.com/cover.jpg";
  expect(() =>
    validateProjectContent(remoteMedia, "remote-media.json", new Set()),
  ).toThrow("media.cover");

  for (const path of [
    "http://example.com/image.png",
    "//example.com/image.png",
    "/../package.json",
    "/images/../outside.svg",
    "/./outside.svg",
    "\\images\\outside.svg",
  ]) {
    const invalidPath = cloneSource();
    (invalidPath.media as Record<string, unknown>).cover = path;
    expect(() =>
      validateProjectContent(invalidPath, "invalid-media-path.json", new Set()),
    ).toThrow("media.cover");
  }

  const validLocalMedia = cloneSource();
  (validLocalMedia.media as Record<string, unknown>).cover = "/images/projects/test-cover.png";
  expect(() =>
    validateProjectContent(validLocalMedia, "local-media.json", new Set()),
  ).not.toThrow();

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

test("keeps templates out of runtime registries and accepts future additions at the data boundary", () => {
  const projectDirectory = path.join(process.cwd(), "content", "projects");
  const runtimeJsonFiles = readdirSync(projectDirectory).filter((file) =>
    file.endsWith(".json"),
  );
  const templateDirectory = path.join(process.cwd(), "content", "templates");

  expect(runtimeJsonFiles).toHaveLength(2);
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

  const futureSource = cloneSource();
  futureSource.id = 14;
  futureSource.slug = "future-project";
  futureSource.title = "Future project";
  futureSource.order = 3;
  futureSource.featured = false;
  const futureProjects = validateProjectRegistry(
    [
      ...PROJECT_CONTENT.map((content, index) =>
        registration(content, `active-project-${index}.json`),
      ),
      registration(futureSource, "future-project.json"),
    ],
    SKILL_IDS,
  );
  const futureContent = futureProjects.at(-1)!;
  expect(futureProjects.map((project) => project.slug)).toEqual([
    ...ACTIVE_SLUGS,
    "future-project",
  ]);
  expect(normaliseProjectContent(futureContent)).toEqual(
    expect.objectContaining({
      slug: futureContent.slug,
      title: futureContent.title,
      summary: futureContent.card.summary,
    }),
  );
  const registrySource = readFileSync(
    path.join(projectDirectory, "projects.index.ts"),
    "utf8",
  );
  expect(registrySource).not.toMatch(/allowedSlugs|slice\(\s*0\s*,\s*2\s*\)/);
});
