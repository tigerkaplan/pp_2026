import type {
  ProjectContent,
  ProjectRegistration,
} from "./project-content";
import { isSafeProjectMediaPath } from "@/lib/project-media-path";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function fail(source: string, message: string): never {
  throw new Error(`Invalid project content in ${source}: ${message}`);
}

function requiredString(
  record: Record<string, unknown>,
  key: string,
  source: string,
): string {
  const value = record[key];
  if (typeof value !== "string" || value.trim() === "") {
    fail(source, `${key} must be a non-empty string`);
  }
  return value;
}

function optionalString(
  record: Record<string, unknown>,
  key: string,
  source: string,
): string | undefined {
  const value = record[key];
  if (value === undefined) return undefined;
  if (typeof value !== "string") {
    fail(source, `${key} must be a string when provided`);
  }
  return value;
}

function requiredBoolean(
  record: Record<string, unknown>,
  key: string,
  source: string,
): boolean {
  const value = record[key];
  if (typeof value !== "boolean") {
    fail(source, `${key} must be a boolean`);
  }
  return value;
}

function requiredInteger(
  record: Record<string, unknown>,
  key: string,
  source: string,
): number {
  const value = record[key];
  if (typeof value !== "number" || !Number.isInteger(value)) {
    fail(source, `${key} must be an integer`);
  }
  return value;
}

function stringArray(
  value: unknown,
  field: string,
  source: string,
): string[] {
  if (
    !Array.isArray(value) ||
    value.some((item) => typeof item !== "string" || item.trim() === "")
  ) {
    fail(source, `${field} must be an array of non-empty strings`);
  }
  return value;
}

function requiredRecord(
  record: Record<string, unknown>,
  key: string,
  source: string,
): Record<string, unknown> {
  const value = record[key];
  if (!isRecord(value)) fail(source, `${key} must be an object`);
  return value;
}

function nullableUrl(
  record: Record<string, unknown>,
  key: string,
  source: string,
): string | null {
  const value = record[key];
  if (value === null) return null;
  if (typeof value !== "string" || value.trim() === "") {
    fail(source, `links.${key} must be null or a non-empty URL`);
  }

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    fail(source, `links.${key} must be a valid URL`);
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    fail(source, `links.${key} must use http or https`);
  }
  return value;
}

function validMediaPath(value: string): boolean {
  return isSafeProjectMediaPath(value);
}

function optionalStringArray(
  record: Record<string, unknown>,
  key: string,
  source: string,
): string[] | undefined {
  if (record[key] === undefined) return undefined;
  return stringArray(record[key], key, source);
}

export function validateProjectContent(
  value: unknown,
  source: string,
  knownSkillIds: ReadonlySet<string>,
): ProjectContent {
  if (!isRecord(value)) fail(source, "root must be an object");
  if (/project\.template\.json$/i.test(source)) {
    fail(source, "project template must not be registered at runtime");
  }

  const id = requiredInteger(value, "id", source);
  const slug = requiredString(value, "slug", source);
  const title = requiredString(value, "title", source);
  const shortTitle = optionalString(value, "shortTitle", source);
  const featured = requiredBoolean(value, "featured", source);
  const status = optionalString(value, "status", source);
  const category = optionalString(value, "category", source);
  const year = requiredInteger(value, "year", source);
  const role = requiredString(value, "role", source);
  const tags = stringArray(value.tags, "tags", source);
  const order = requiredInteger(value, "order", source);
  if (id < 1) fail(source, "id must be greater than zero");
  if (order < 1) fail(source, "order must be greater than zero");

  const card = requiredRecord(value, "card", source);
  const summary = requiredString(card, "summary", source);
  const highlights = stringArray(
    card.highlights,
    "card.highlights",
    source,
  );
  const technologies = stringArray(
    value.technologies,
    "technologies",
    source,
  );
  const skillIds = stringArray(value.skillIds, "skillIds", source);
  for (const skillId of skillIds) {
    if (!knownSkillIds.has(skillId)) {
      fail(source, `unknown skillId "${skillId}"`);
    }
  }

  const links = requiredRecord(value, "links", source);
  const live = nullableUrl(links, "live", source);
  const github = nullableUrl(links, "github", source);

  const media = requiredRecord(value, "media", source);
  const coverValue = media.cover;
  if (
    coverValue !== null &&
    (typeof coverValue !== "string" || !validMediaPath(coverValue))
  ) {
    fail(source, "media.cover must be null or a valid media path");
  }
  const cover = coverValue as string | null;
  const coverAlt = optionalString(media, "coverAlt", source);
  if (coverAlt === undefined) {
    fail(source, "media.coverAlt must be a string");
  }
  const gallery = stringArray(media.gallery, "media.gallery", source);
  if (gallery.some((item) => !validMediaPath(item))) {
    fail(source, "media.gallery contains an invalid media path");
  }

  const caseStudy = requiredRecord(value, "caseStudy", source);
  const problem = requiredString(caseStudy, "problem", source);
  const solution = requiredString(caseStudy, "solution", source);
  const result = requiredString(caseStudy, "result", source);

  const display = requiredRecord(value, "display", source);
  const showLiveLink = requiredBoolean(display, "showLiveLink", source);
  const showGithubLink = requiredBoolean(display, "showGithubLink", source);
  const showPreview = requiredBoolean(display, "showPreview", source);
  const showFullProject = requiredBoolean(
    display,
    "showFullProject",
    source,
  );
  if (showLiveLink !== Boolean(live)) {
    fail(source, "display.showLiveLink must match the live link");
  }
  if (showGithubLink !== Boolean(github)) {
    fail(source, "display.showGithubLink must match the GitHub link");
  }
  if (featured && !showPreview && !showFullProject) {
    fail(source, "a featured project must expose Preview or full project");
  }

  const evidenceValue = value.evidence;
  let evidence: ProjectContent["evidence"];
  if (evidenceValue !== undefined) {
    if (!isRecord(evidenceValue)) fail(source, "evidence must be an object");
    evidence = {
      accessibility: stringArray(
        evidenceValue.accessibility,
        "evidence.accessibility",
        source,
      ),
      testing: stringArray(
        evidenceValue.testing,
        "evidence.testing",
        source,
      ),
      integration: stringArray(
        evidenceValue.integration,
        "evidence.integration",
        source,
      ),
      delivery: stringArray(
        evidenceValue.delivery,
        "evidence.delivery",
        source,
      ),
    };
  }

  const seoValue = value.seo;
  let seo: ProjectContent["seo"];
  if (seoValue !== undefined) {
    if (!isRecord(seoValue)) fail(source, "seo must be an object");
    const ogImage = seoValue.ogImage;
    if (
      ogImage !== null &&
      (typeof ogImage !== "string" || !validMediaPath(ogImage))
    ) {
      fail(source, "seo.ogImage must be null or a valid media path");
    }
    seo = {
      title: optionalString(seoValue, "title", source) ?? "",
      description: optionalString(seoValue, "description", source) ?? "",
      ogImage: ogImage as string | null,
    };
  }

  return {
    id,
    slug,
    title,
    ...(shortTitle !== undefined ? { shortTitle } : {}),
    featured,
    ...(status !== undefined ? { status } : {}),
    ...(category !== undefined ? { category } : {}),
    year,
    role,
    tags,
    order,
    card: { summary, highlights },
    technologies,
    skillIds,
    links: { live, github },
    media: { cover, coverAlt, gallery },
    caseStudy: {
      ...(optionalString(caseStudy, "overview", source) !== undefined
        ? { overview: optionalString(caseStudy, "overview", source) }
        : {}),
      ...(optionalString(caseStudy, "context", source) !== undefined
        ? { context: optionalString(caseStudy, "context", source) }
        : {}),
      problem,
      ...(optionalString(caseStudy, "challenge", source) !== undefined
        ? { challenge: optionalString(caseStudy, "challenge", source) }
        : {}),
      ...(optionalStringArray(caseStudy, "objectives", source) !== undefined
        ? { objectives: optionalStringArray(caseStudy, "objectives", source) }
        : {}),
      ...(optionalStringArray(caseStudy, "approach", source) !== undefined
        ? { approach: optionalStringArray(caseStudy, "approach", source) }
        : {}),
      solution,
      ...(optionalStringArray(caseStudy, "accessibility", source) !== undefined
        ? {
            accessibility: optionalStringArray(
              caseStudy,
              "accessibility",
              source,
            ),
          }
        : {}),
      ...(optionalStringArray(caseStudy, "testing", source) !== undefined
        ? { testing: optionalStringArray(caseStudy, "testing", source) }
        : {}),
      ...(optionalStringArray(
        caseStudy,
        "technicalImplementation",
        source,
      ) !== undefined
        ? {
            technicalImplementation: optionalStringArray(
              caseStudy,
              "technicalImplementation",
              source,
            ),
          }
        : {}),
      result,
      ...(optionalStringArray(caseStudy, "outcomes", source) !== undefined
        ? { outcomes: optionalStringArray(caseStudy, "outcomes", source) }
        : {}),
      ...(optionalStringArray(caseStudy, "limitations", source) !== undefined
        ? {
            limitations: optionalStringArray(
              caseStudy,
              "limitations",
              source,
            ),
          }
        : {}),
      ...(optionalStringArray(caseStudy, "nextSteps", source) !== undefined
        ? { nextSteps: optionalStringArray(caseStudy, "nextSteps", source) }
        : {}),
    },
    ...(evidence !== undefined ? { evidence } : {}),
    ...(seo !== undefined ? { seo } : {}),
    display: {
      showLiveLink,
      showGithubLink,
      showPreview,
      showFullProject,
    },
  };
}

export function validateProjectRegistry(
  registrations: readonly ProjectRegistration[],
  knownSkillIds: ReadonlySet<string>,
): ProjectContent[] {
  const projects = registrations.map(({ source, content }) =>
    validateProjectContent(content, source, knownSkillIds),
  );
  const ids = new Set<number>();
  const slugs = new Set<string>();
  const orders = new Set<number>();

  for (const project of projects) {
    if (ids.has(project.id)) {
      throw new Error(`Duplicate project id: ${project.id}`);
    }
    if (slugs.has(project.slug)) {
      throw new Error(`Duplicate project slug: ${project.slug}`);
    }
    if (orders.has(project.order)) {
      throw new Error(`Duplicate project order: ${project.order}`);
    }
    ids.add(project.id);
    slugs.add(project.slug);
    orders.add(project.order);
  }

  return [...projects].sort((left, right) => left.order - right.order);
}
