import type { Project } from "../_types/project";
import { PROJECTS } from "./projects.data";

export async function getProjects(): Promise<Project[]> {
  return PROJECTS;
}

export async function getPublishedProjects(): Promise<Project[]> {
  return PROJECTS.filter((project) =>
    Object.values(project.evidence ?? {}).some((items) => items.length > 0),
  );
}
