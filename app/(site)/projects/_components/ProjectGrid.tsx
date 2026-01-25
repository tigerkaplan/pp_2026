import type { Project } from "../_types/project";
import ProjectCard from "./ProjectCard";

export default function ProjectGrid({
  projects,
  variant = "default",
}: {
  projects: Project[];
  variant?: "default" | "featured";
}) {
  const gridClass =
    variant === "featured"
      ? "grid grid-cols-1 lg:grid-cols-2 gap-6" // featured: 2 in a row on lg+
      : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"; // all: 3 in a row on lg+

  return (
    <div className={gridClass}>
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} variant={variant} />
      ))}
    </div>
  );
}
