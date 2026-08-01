import type { Project } from "../_types/project";
import { PROJECTS } from "./projects.data";

export async function getProjects(): Promise<Project[]> {
  return PROJECTS;
}
