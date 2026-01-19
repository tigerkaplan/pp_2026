import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProjectBySlug } from "../_lib/getProjectBySlug";

type Props = {
  params: Promise<{ slug: string }>;
};

// Optional but recommended for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: "Project not found" };
  }

  const title = `${project.title} | Projects`;
  const description = project.summary;

  const ogImage =
    project.images?.[0] ? project.images[0] : "/images/og/projects-default.png";

  return {
    title,
    description,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/projects/${project.slug}`,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
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
          className="inline-flex items-center gap-2 text-sm opacity-80 hover:opacity-100"
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
              className="rounded-full bg-muted px-2 py-1 text-xs"
            >
              {t}
            </span>
          ))}
          <span className="text-xs opacity-60">•</span>
          <span className="text-xs opacity-70">{project.year}</span>
          <span className="text-xs opacity-60">•</span>
          <span className="text-xs opacity-70">{project.role}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          {project.title}
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground max-w-3xl">
          {project.summary}
        </p>

        {/* Links */}
        <div className="flex flex-wrap gap-3 pt-2">
          {project.links?.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border px-3 py-2 text-sm hover:bg-muted"
            >
              Live demo
            </a>
          )}
          {project.links?.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border px-3 py-2 text-sm hover:bg-muted"
            >
              GitHub
            </a>
          )}
        </div>
      </header>

      {/* Hero image */}
      {project.images?.[0] && (
        <figure className="overflow-hidden rounded-2xl border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.images[0]}
            alt={`${project.title} cover`}
            className="h-[320px] w-full object-cover sm:h-[420px]"
            loading="eager"
          />
        </figure>
      )}

      {/* Stack */}
      {project.stack?.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Tech stack</h2>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((t) => (
              <span
                key={t}
                className="rounded-full bg-muted px-3 py-1 text-xs"
              >
                {t}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Case study */}
      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border p-5 space-y-2">
          <h2 className="font-semibold">Problem</h2>
          <p className="text-sm text-muted-foreground">{project.problem}</p>
        </div>

        <div className="rounded-2xl border p-5 space-y-2">
          <h2 className="font-semibold">Solution</h2>
          <p className="text-sm text-muted-foreground">{project.solution}</p>
        </div>

        <div className="rounded-2xl border p-5 space-y-2">
          <h2 className="font-semibold">Result</h2>
          <p className="text-sm text-muted-foreground">{project.result}</p>
        </div>
      </section>

      {/* Features */}
      {project.features?.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Key features</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {project.features.map((f) => (
              <li
                key={f}
                className="rounded-xl border bg-background p-4 text-sm"
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
          <h2 className="text-lg font-semibold">Screenshots</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {project.images.slice(1).map((src, idx) => (
              <figure
                key={`${src}-${idx}`}
                className="overflow-hidden rounded-2xl border bg-muted"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`${project.title} screenshot ${idx + 1}`}
                  className="h-64 w-full object-cover"
                  loading="lazy"
                />
              </figure>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
