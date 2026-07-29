import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProjectBySlug } from "../_lib/getProjectBySlug";
import { getProjects } from "../_lib/getProjects";
import { ProjectMedia } from "../_components/ProjectMedia";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) return { title: "Project not found" };

  const title = `${project.title} | Projects`;
  const description = project.summary;

  return {
    title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/projects/${project.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;

  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <article className="space-y-10">
      {/* Back */}
      <div>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-[rgb(var(--color-fg-muted))] hover:text-[rgb(var(--color-fg))] sm:text-base"
        >
          ← Back to projects
        </Link>
      </div>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {project.tags?.map((t) => (
            <span
              key={t}
              className={[
                "rounded-full px-2 py-1 text-xs ring-1 backdrop-blur",
                "bg-[rgb(var(--color-surface)/0.18)]",
                "text-[rgb(var(--color-fg-muted))]",
                "ring-[rgb(var(--color-border))]",
              ].join(" ")}
            >
              {t}
            </span>
          ))}
          <span className="text-xs text-[rgb(var(--color-fg-muted))] opacity-70">
            •
          </span>
          <span className="text-xs text-[rgb(var(--color-fg-muted))]">
            {project.year}
          </span>
          <span className="text-xs text-[rgb(var(--color-fg-muted))] opacity-70">
            •
          </span>
          <span className="text-xs text-[rgb(var(--color-fg-muted))]">
            {project.role}
          </span>
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-[rgb(var(--color-fg))] sm:text-5xl">
          {project.title}
        </h1>

        <p className="max-w-3xl text-base leading-7 text-[rgb(var(--color-fg-muted))] sm:text-lg">
          {project.summary}
        </p>

        {/* Links */}
        <div className="flex flex-wrap gap-3 pt-2">
          {project.links?.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noreferrer"
              className={[
                "rounded-md border px-3 py-2 text-sm transition sm:text-base",
                "border-[rgb(var(--color-border))]",
                "text-[rgb(var(--color-fg))]",
                "hover:bg-[rgb(var(--color-surface)/0.22)]",
              ].join(" ")}
            >
              Live demo
            </a>
          )}
          {project.links?.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noreferrer"
              className={[
                "rounded-md border px-3 py-2 text-sm transition sm:text-base",
                "border-[rgb(var(--color-border))]",
                "text-[rgb(var(--color-fg))]",
                "hover:bg-[rgb(var(--color-surface)/0.22)]",
              ].join(" ")}
            >
              GitHub
            </a>
          )}
        </div>
      </header>

      {/* Hero image */}
      <figure
        className={[
          "overflow-hidden rounded-2xl border",
          "border-[rgb(var(--color-border))]",
          "bg-[rgb(var(--color-surface)/0.18)]",
        ].join(" ")}
      >
        <div className="relative h-[320px] w-full sm:h-[420px]">
          <ProjectMedia
            src={project.images?.[0]}
            title={project.title}
            className="h-[320px] w-full object-cover sm:h-[420px]"
            priority
            sizes="(min-width: 768px) 70vw, 100vw"
          />
        </div>
      </figure>

      {/* Stack */}
      {project.stack?.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[rgb(var(--color-fg))] sm:text-2xl">
            Tech stack
          </h2>

          <div className="flex flex-wrap gap-2">
            {project.stack.map((t) => (
              <span
                key={t}
                className={[
                  "rounded-full px-3 py-1 text-xs ring-1 backdrop-blur sm:text-sm",
                  "bg-[rgb(var(--color-surface)/0.18)]",
                  "text-[rgb(var(--color-fg-muted))]",
                  "ring-[rgb(var(--color-border))]",
                ].join(" ")}
              >
                {t}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Case study */}
      <section className="grid gap-6 md:grid-cols-3">
        <div
          className={[
            "space-y-2 rounded-2xl border p-5",
            "border-[rgb(var(--color-border))]",
            "bg-[rgb(var(--color-surface)/0.14)]",
          ].join(" ")}
        >
          <h2 className="text-lg font-semibold text-[rgb(var(--color-fg))]">Problem</h2>
          <p className="text-sm leading-6 text-[rgb(var(--color-fg-muted))] sm:text-base">
            {project.problem}
          </p>
        </div>

        <div
          className={[
            "space-y-2 rounded-2xl border p-5",
            "border-[rgb(var(--color-border))]",
            "bg-[rgb(var(--color-surface)/0.14)]",
          ].join(" ")}
        >
          <h2 className="text-lg font-semibold text-[rgb(var(--color-fg))]">Solution</h2>
          <p className="text-sm leading-6 text-[rgb(var(--color-fg-muted))] sm:text-base">
            {project.solution}
          </p>
        </div>

        <div
          className={[
            "space-y-2 rounded-2xl border p-5",
            "border-[rgb(var(--color-border))]",
            "bg-[rgb(var(--color-surface)/0.14)]",
          ].join(" ")}
        >
          <h2 className="text-lg font-semibold text-[rgb(var(--color-fg))]">Result</h2>
          <p className="text-sm leading-6 text-[rgb(var(--color-fg-muted))] sm:text-base">
            {project.result}
          </p>
        </div>
      </section>

      {/* Features */}
      {project.features?.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-[rgb(var(--color-fg))] sm:text-2xl">
            Key features
          </h2>

          <ul className="grid gap-2 sm:grid-cols-2">
            {project.features.map((f) => (
              <li
                key={f}
                className={[
                  "rounded-xl border p-4 text-sm leading-6 sm:text-base",
                  "border-[rgb(var(--color-border))]",
                  "bg-[rgb(var(--color-surface)/0.14)]",
                  "text-[rgb(var(--color-fg))]",
                ].join(" ")}
              >
                {f}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Gallery */}
      {project.images?.length > 1 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-[rgb(var(--color-fg))] sm:text-2xl">
            Screenshots
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {project.images.slice(1).map((src, idx) => (
              <figure
                key={`${src}-${idx}`}
                className={[
                  "overflow-hidden rounded-2xl border",
                  "border-[rgb(var(--color-border))]",
                  "bg-[rgb(var(--color-surface)/0.18)]",
                ].join(" ")}
              >
                <div className="relative h-64 w-full">
                  <ProjectMedia
                  src={src}
                    title={project.title}
                    className="object-cover"
                    sizes="(min-width: 640px) 35vw, 100vw"
                  />
                </div>
              </figure>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
