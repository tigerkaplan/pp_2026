import type { Project } from "../_types/project";
import { getPublishedProjects } from "./getProjects";

export async function getProjectBySlug(
  slug: string
): Promise<Project | undefined> {
  return (await getPublishedProjects()).find((p) => p.slug === slug);
}
