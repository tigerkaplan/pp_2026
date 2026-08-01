import { getProjects } from "./_lib/getProjects";
import ProjectGrid from "./_components/ProjectGrid";
import OnThisPageProjects from "@/components/navigation/OnThisPage";

export const metadata = {
  title: "Projects",
  description:
    "A selection of projects showcasing Next.js, .NET, API and SEO solutions.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  const featured = projects.filter((p) => p.featured);
  const additionalProjects = projects.filter((p) => !p.featured);

  return (
    <div className="relative" data-projects-page>
      {/* Right-side menu (fixed) */}
      <OnThisPageProjects projects={projects} />

      <section className="space-y-12 min-[1800px]:pr-80">
        <header className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Projects</h1>
          <p className="max-w-3xl text-base leading-7 text-[rgb(var(--color-fg-muted))] lg:text-[17px]">
            A selection of projects showcasing a variety of technologies and
            solutions I’ve worked on.
          </p>
        </header>

        {featured.length > 0 && (
          <section className="space-y-4">
            <h2
              id="featured-projects"
              className="scroll-mt-28 text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              Featured Projects
            </h2>
            <ProjectGrid projects={featured} variant="featured" />
          </section>
        )}

        {additionalProjects.length > 0 ? (
          <section className="space-y-4">
            <h2
              id="all-projects"
              className="scroll-mt-28 text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              All Projects
            </h2>
            <ProjectGrid projects={additionalProjects} variant="all" />
          </section>
        ) : null}
      </section>
    </div>
  );
}
