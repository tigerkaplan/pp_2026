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
const CLIVE_SLUG = "clive-lutley-painting-gallery";
const BAKERY_SLUG = "bakery-project";
const ACTIVE_SLUGS = [COUNCIL_SLUG, PORTFOLIO_SLUG, CLIVE_SLUG, BAKERY_SLUG];
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

test("keeps the active project records in registry order", () => {
  expect(PROJECTS).toHaveLength(4);
  expect(PROJECTS.map((project) => project.slug)).toEqual(ACTIVE_SLUGS);
  expect(PROJECTS.map((project) => project.title)).toEqual([
    "Council Digital Platforms Mini Lab",
    "Personal Portfolio 2026",
    "Clive Lutley Painting Gallery",
    "Patisserie 4 You",
  ]);
  expect(PROJECTS.map((project) => project.featured)).toEqual([true, true, false, false]);
  expect(PROJECT_CONTENT.map((project) => project.order)).toEqual([1, 2, 3, 4]);
  expect(PROJECTS.map((project) => project.id)).toEqual([13, 1, 14, 15]);
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
      links: {
        live: "https://husniyeerparundev.netlify.app/",
        github: "https://github.com/tigerkaplan/pp_2026",
      },
      display: {
        showLiveLink: true,
        showGithubLink: true,
        showPreview: true,
        showFullProject: true,
      },
    }),
  ]);
});

test("registers Council with only approved skill evidence and verified public links", () => {
  const council = PROJECT_CONTENT.find(
    (project) => project.slug === COUNCIL_SLUG,
  );

  expect(council).toMatchObject({
    id: 13,
    featured: true,
    order: 1,
    title: "Council Digital Platforms Mini Lab",
    links: {
      live: "https://council-digital-platforms-mini-lab.netlify.app/",
      github: "https://github.com/tigerkaplan/council-digital-platforms-mini-lab",
    },
    display: {
      showLiveLink: true,
      showGithubLink: true,
      showPreview: true,
      showFullProject: true,
    },
    media: {
      cover: "/images/projects/council-digital-platforms-mini-lab/cover.png",
      coverAlt: "Council Digital Platforms Mini Lab case study overview page",
      gallery: [],
    },
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
    links: {
      live: "https://council-digital-platforms-mini-lab.netlify.app/",
      github: "https://github.com/tigerkaplan/council-digital-platforms-mini-lab",
    },
    images: ["/images/projects/council-digital-platforms-mini-lab/cover.png"],
  });
});

test("registers Clive Lutley Painting Gallery with approved public content and media", () => {
  const clive = PROJECT_CONTENT.find((project) => project.slug === CLIVE_SLUG);

  expect(clive).toMatchObject({
    id: 14,
    order: 3,
    featured: false,
    title: "Clive Lutley Painting Gallery",
    category: "Artist Portfolio & Gallery",
    links: {
      live: "https://cl-painting-gallery.netlify.app",
      github: "https://github.com/tigerkaplan/cl-painting-gallery",
    },
    media: {
      cover: "/images/projects/clive-lutley-painting-gallery/cover.png",
      coverAlt:
        "English homepage showing the Clive Lutley logo, artist portrait, navigation and gallery call to action.",
      gallery: [
        "/images/projects/clive-lutley-painting-gallery/gallery-view.png",
        "/images/projects/clive-lutley-painting-gallery/about-page.png",
        "/images/projects/clive-lutley-painting-gallery/events-page.png",
      ],
    },
    display: {
      showLiveLink: true,
      showGithubLink: true,
      showPreview: true,
      showFullProject: true,
    },
  });
  expect(clive?.skillIds).toEqual([]);
  expect(clive?.caseStudy.problem).toContain("clear, responsive website");
  expect(PROJECTS.find((project) => project.slug === CLIVE_SLUG)).toMatchObject({
    slug: CLIVE_SLUG,
    images: [
      "/images/projects/clive-lutley-painting-gallery/cover.png",
      "/images/projects/clive-lutley-painting-gallery/gallery-view.png",
      "/images/projects/clive-lutley-painting-gallery/about-page.png",
      "/images/projects/clive-lutley-painting-gallery/events-page.png",
    ],
  });
});

test("registers Bakery as selected client work with approved media and public links", () => {
  const bakery = PROJECT_CONTENT.find((project) => project.slug === BAKERY_SLUG);

  expect(bakery).toMatchObject({
    id: 15,
    order: 4,
    featured: false,
    category: "Client Work",
    skillIds: ["keyboard-accessibility"],
    links: {
      live: "https://bakeryprojectapp.netlify.app/",
      github: "https://github.com/tigerkaplan/bakeryProject",
    },
    media: {
      cover: "/images/projects/bakery-project/cover.png",
      gallery: [
        "/images/projects/bakery-project/desktop-overview.png",
        "/images/projects/bakery-project/menu-filtering.png",
        "/images/projects/bakery-project/favourite-interaction.png",
        "/images/projects/bakery-project/mobile-navigation.png",
        "/images/projects/bakery-project/mission-media.png",
      ],
    },
  });
  expect(bakery?.skillIds.every((skillId) => SKILL_IDS.has(skillId))).toBe(true);
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
    {
      cover: "/images/projects/council-digital-platforms-mini-lab/cover.png",
      coverAlt: "Council Digital Platforms Mini Lab case study overview page",
      gallery: [],
    },
  );
  expect(PROJECT_CONTENT.find((project) => project.slug === PORTFOLIO_SLUG)?.media).toEqual(
    {
      cover: "/images/projects/personal-portfolio-2026/homepage.png",
      coverAlt: "Personal Portfolio 2026 homepage showing navigation, featured projects and project cards",
      gallery: [],
    },
  );
  expect(PROJECT_CONTENT.find((project) => project.slug === CLIVE_SLUG)?.media).toEqual(
    {
      cover: "/images/projects/clive-lutley-painting-gallery/cover.png",
      coverAlt:
        "English homepage showing the Clive Lutley logo, artist portrait, navigation and gallery call to action.",
      gallery: [
        "/images/projects/clive-lutley-painting-gallery/gallery-view.png",
        "/images/projects/clive-lutley-painting-gallery/about-page.png",
        "/images/projects/clive-lutley-painting-gallery/events-page.png",
      ],
    },
  );
  expect(PROJECT_CONTENT.find((project) => project.slug === BAKERY_SLUG)?.media).toEqual(
    {
      cover: "/images/projects/bakery-project/cover.png",
      coverAlt: "Patisserie 4 You homepage with coffee-bean hero image, navigation and bakery name.",
      gallery: [
        "/images/projects/bakery-project/desktop-overview.png",
        "/images/projects/bakery-project/menu-filtering.png",
        "/images/projects/bakery-project/favourite-interaction.png",
        "/images/projects/bakery-project/mobile-navigation.png",
        "/images/projects/bakery-project/mission-media.png",
      ],
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

  expect(runtimeJsonFiles).toHaveLength(4);
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
  futureSource.id = 16;
  futureSource.slug = "future-project";
  futureSource.title = "Future project";
  futureSource.order = 5;
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
