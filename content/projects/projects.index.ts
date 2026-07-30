import type { Project } from "@/app/(site)/projects/_types/project";
import { SKILL_IDS } from "@/content/skills/skills.index";
import apiIntegrationService from "./api-integration-service.json";
import authenticationService from "./authentication-service.json";
import blogPlatform from "./blog-platform.json";
import contentManagementSystem from "./content-management-system.json";
import councilDigitalPlatformsMiniLab from "./council-digital-platforms-mini-lab.json";
import elearningPlatform from "./elearning-platform.json";
import inventoryManagementApi from "./inventory-management-api.json";
import nextjsEcommercePlatform from "./nextjs-ecommerce-platform.json";
import performanceMonitoringDashboard from "./performance-monitoring-dashboard.json";
import seoOptimizationDashboard from "./seo-optimization-dashboard.json";
import seoPortfolioPlatform from "./seo-portfolio-platform.json";
import taskManagementApp from "./task-management-app.json";
import webScraperApi from "./web-scraper-api.json";
import type { ProjectContent, ProjectRegistration } from "./project-content";
import { validateProjectRegistry } from "./validate-projects";

const PROJECT_REGISTRY: readonly ProjectRegistration[] = [
  {
    source: "content/projects/council-digital-platforms-mini-lab.json",
    content: councilDigitalPlatformsMiniLab,
  },
  {
    source: "content/projects/seo-portfolio-platform.json",
    content: seoPortfolioPlatform,
  },
  {
    source: "content/projects/nextjs-ecommerce-platform.json",
    content: nextjsEcommercePlatform,
  },
  {
    source: "content/projects/inventory-management-api.json",
    content: inventoryManagementApi,
  },
  {
    source: "content/projects/seo-optimization-dashboard.json",
    content: seoOptimizationDashboard,
  },
  {
    source: "content/projects/content-management-system.json",
    content: contentManagementSystem,
  },
  {
    source: "content/projects/authentication-service.json",
    content: authenticationService,
  },
  {
    source: "content/projects/performance-monitoring-dashboard.json",
    content: performanceMonitoringDashboard,
  },
  {
    source: "content/projects/web-scraper-api.json",
    content: webScraperApi,
  },
  {
    source: "content/projects/elearning-platform.json",
    content: elearningPlatform,
  },
  {
    source: "content/projects/task-management-app.json",
    content: taskManagementApp,
  },
  {
    source: "content/projects/blog-platform.json",
    content: blogPlatform,
  },
  {
    source: "content/projects/api-integration-service.json",
    content: apiIntegrationService,
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
