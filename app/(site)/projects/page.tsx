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

  return (
    <div className="relative">
      {/* Right-side menu (fixed) */}
      <OnThisPageProjects projects={projects} />

      {/* Add right padding on lg so content doesn't sit under the menu */}
      <section className="space-y-12 lg:pr-80">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold">Projects</h1>
          <p className="text-neutral-600">
            A selection of projects showcasing a variety of technologies and
            solutions I’ve worked on.
          </p>
        </header>

        {featured.length > 0 && (
  <section className="space-y-4">
    <h2 id="featured-projects" className="scroll-mt-28 text-xl font-semibold">
      Featured Projects
    </h2>
    <ProjectGrid projects={featured} variant="featured" />
  </section>
)}

<section className="space-y-4">
  <h2 id="all-projects" className="scroll-mt-28 text-xl font-semibold">
    All Projects
  </h2>
  <ProjectGrid projects={projects.filter((p) => !p.featured)} variant="default" />
</section>

      </section>
    </div>
  );
}
