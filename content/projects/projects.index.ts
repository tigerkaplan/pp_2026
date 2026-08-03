import type { Project } from "@/app/(site)/projects/_types/project";
import { SKILL_IDS } from "@/content/skills/skills.index";
import councilDigitalPlatformsMiniLab from "./council-digital-platforms-mini-lab.json";
import cliveLutleyPaintingGallery from "./clive-lutley-painting-gallery.json";
import personalPortfolio2026 from "./personal-portfolio-2026.json";
import type { ProjectContent, ProjectRegistration } from "./project-content";
import { validateProjectRegistry } from "./validate-projects";

const PROJECT_REGISTRY: readonly ProjectRegistration[] = [
  {
    source: "content/projects/council-digital-platforms-mini-lab.json",
    content: councilDigitalPlatformsMiniLab,
  },
  {
    source: "content/projects/personal-portfolio-2026.json",
    content: personalPortfolio2026,
  },
  {
    source: "content/projects/clive-lutley-painting-gallery.json",
    content: cliveLutleyPaintingGallery,
  },
];

export function normaliseProjectContent(content: ProjectContent): Project {
  return {
    id: content.id,
    slug: content.slug,
    title: content.title,
    ...(content.shortTitle ? { shortTitle: content.shortTitle } : {}),
    summary: content.card.summary,
    featured: content.featured,
    ...(content.status ? { status: content.status } : {}),
    ...(content.category ? { category: content.category } : {}),
    year: content.year,
    role: content.role,
    stack: [...content.technologies],
    tags: [...content.tags],
    problem: content.caseStudy.problem,
    solution: content.caseStudy.solution,
    result: content.caseStudy.result,
    features: [...content.card.highlights],
    images: [
      ...(content.media.cover ? [content.media.cover] : []),
      ...content.media.gallery,
    ],
    links: {
      ...(content.links.live ? { live: content.links.live } : {}),
      ...(content.links.github ? { github: content.links.github } : {}),
    },
    media: { cover: content.media.cover, coverAlt: content.media.coverAlt, gallery: [...content.media.gallery] },
    caseStudy: { ...content.caseStudy },
    ...(content.evidence ? { evidence: { ...content.evidence } } : {}),
    display: { ...content.display },
    ...(content.seo ? { seo: { ...content.seo } } : {}),
  };
}

export const PROJECT_CONTENT = validateProjectRegistry(
  PROJECT_REGISTRY,
  SKILL_IDS,
);

export const PROJECTS: Project[] = PROJECT_CONTENT.map(normaliseProjectContent);
