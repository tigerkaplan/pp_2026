import type { Project } from "../_types/project";
import ProjectCard from "./ProjectCard";

export default function ProjectGrid({
  projects,
  variant,
}: {
  projects: Project[];
  variant: "all" | "featured";
}) {
  const gridClass =
    variant === "featured"
      ? "grid grid-cols-1 gap-6 lg:grid-cols-2"
      : "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3";
  const cardVariant = variant === "featured" ? "featured" : "default";

  return (
    <div className={gridClass} data-project-grid={variant}>
      {projects.map((project) => (
        <ProjectCard
          key={project.slug}
          project={project}
          variant={cardVariant}
        />
      ))}
    </div>
  );
}
