import type { Project } from "../_types/project";
import { PROJECTS } from "./projects.data";

export async function getProjectBySlug(
  slug: string
): Promise<Project | undefined> {
  return PROJECTS.find((p) => p.slug === slug);
}
