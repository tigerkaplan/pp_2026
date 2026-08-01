import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedProjects } from "./projects/_lib/getProjects";
import { SKILL_GROUPS, SKILLS } from "@/content/skills/skills.index";

export const metadata: Metadata = {
  title: "Home",
  description:
    "A portfolio presenting front-end development, accessible interaction patterns and evidence-led project work.",
};

const actionClass =
  "inline-flex min-h-11 items-center justify-center rounded-md border border-[rgb(var(--color-border))] px-4 py-2 text-sm font-medium text-[rgb(var(--color-fg))] transition hover:bg-[rgb(var(--color-surface-weak))]";

export default async function HomePage() {
  const projects = await getPublishedProjects();
  const featuredProjects = projects.filter((project) => project.featured);

  return (
    <div className="space-y-14">
      <section className="max-w-4xl space-y-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[rgb(var(--color-fg-muted))]">
          Personal Portfolio 2026
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-[rgb(var(--color-fg))] sm:text-5xl">
          Front-end development for clear, accessible digital services.
        </h1>
        <p className="max-w-3xl text-base leading-7 text-[rgb(var(--color-fg-muted))] sm:text-lg">
          This portfolio brings together responsive interface work, validated
          content records and practical accessibility patterns through concise
          project summaries and detailed case studies.
        </p>
        <div className="flex flex-wrap gap-3" aria-label="Explore the portfolio">
          <Link href="/projects" className={actionClass}>View projects</Link>
          <Link href="/about" className={actionClass}>About the approach</Link>
          <Link href="/skills" className={actionClass}>Explore skills</Link>
          <Link href="/contact" className={actionClass}>Contact</Link>
        </div>
      </section>

      <section className="space-y-5" aria-labelledby="featured-work-heading">
        <div className="max-w-3xl space-y-2">
          <h2 id="featured-work-heading" className="text-2xl font-semibold tracking-tight text-[rgb(var(--color-fg))] sm:text-3xl">
            Featured work
          </h2>
          <p className="text-[rgb(var(--color-fg-muted))]">
            Each featured record offers a Preview and a standalone Full Project route from the same validated content source.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {featuredProjects.map((project) => (
            <article key={project.slug} className="rounded-2xl border border-[rgb(var(--color-card-border))] bg-[rgb(var(--color-card-surface))] p-5">
              <p className="text-sm text-[rgb(var(--color-fg-muted))]">{project.category ?? "Project"}</p>
              <h3 className="mt-2 text-xl font-semibold text-[rgb(var(--color-fg))]">{project.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[rgb(var(--color-fg-muted))]">{project.summary}</p>
              <Link href={`/projects/${project.slug}`} className="mt-4 inline-flex min-h-11 items-center text-sm font-medium text-[rgb(var(--color-fg))] underline underline-offset-4">
                View full project: {project.title}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-5" aria-labelledby="skills-preview-heading">
        <div className="max-w-3xl space-y-2">
          <h2 id="skills-preview-heading" className="text-2xl font-semibold tracking-tight text-[rgb(var(--color-fg))] sm:text-3xl">
            Skills organised by evidence
          </h2>
          <p className="text-[rgb(var(--color-fg-muted))]">
            The Skills page groups demonstrated practice and developing knowledge rather than presenting an unqualified technology list.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {SKILL_GROUPS.filter((group) => SKILLS.some((skill) => skill.group === group.id)).map((group) => {
            const count = SKILLS.filter((skill) => skill.group === group.id).length;
            return (
              <Link key={group.id} href="/skills" className="rounded-xl border border-[rgb(var(--color-border))] p-4 transition hover:bg-[rgb(var(--color-surface-weak))]">
                <h3 className="font-semibold text-[rgb(var(--color-fg))]">{group.label}</h3>
                <p className="mt-1 text-sm text-[rgb(var(--color-fg-muted))]">{count} documented skill{count === 1 ? "" : "s"}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
