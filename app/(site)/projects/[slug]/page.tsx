import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProjectBySlug } from "../_lib/getProjectBySlug";
import { getPublishedProjects } from "../_lib/getProjects";
import { ProjectMedia } from "../_components/ProjectMedia";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getPublishedProjects()).map(({ slug }) => ({ slug }));
}

// Generated Open Graph output is authoritative for this local-assets-only phase.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProjectBySlug((await params).slug);
  if (!project) return { title: "Project not found" };
  const title = `${project.seo?.title || project.title} | Projects`;
  const description = project.seo?.description || project.summary;
  return { title, description, alternates: { canonical: `/projects/${project.slug}` }, openGraph: { title, description, type: "article", url: `/projects/${project.slug}` }, twitter: { card: "summary_large_image", title, description } };
}

const sectionTitle = "text-xl font-semibold text-[rgb(var(--color-fg))] sm:text-2xl";
const bodyText = "max-w-3xl text-sm leading-6 text-[rgb(var(--color-fg-muted))] sm:text-base";

function TextSection({ title, text }: { title: string; text?: string }) {
  return text ? <section className="space-y-3"><h3 className={sectionTitle}>{title}</h3><p className={bodyText}>{text}</p></section> : null;
}
function ListSection({ title, items, tone = false }: { title: string; items?: string[]; tone?: boolean }) {
  return items?.length ? <section className={["space-y-3 rounded-2xl border p-5", "border-[rgb(var(--color-border))]", tone ? "bg-[rgb(var(--color-surface-strong)/0.22)]" : "bg-[rgb(var(--color-surface)/0.14)]"].join(" ")}><h3 className={sectionTitle}>{title}</h3><ul className="max-w-3xl list-disc space-y-2 pl-5 text-sm leading-6 text-[rgb(var(--color-fg-muted))] sm:text-base">{items.map((item) => <li key={item}>{item}</li>)}</ul></section> : null;
}

export default async function ProjectPage({ params }: Props) {
  const project = await getProjectBySlug((await params).slug);
  if (!project) notFound();
  const { caseStudy } = project;
  const evidence = project.evidence && Object.entries(project.evidence).filter(([, items]) => items.length);
  const gallery = project.media.gallery;

  return <article className="space-y-10">
    <header className="max-w-3xl space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-xs text-[rgb(var(--color-fg-muted))]">
        {project.category ? <span className="rounded-full px-2 py-1 ring-1 ring-[rgb(var(--color-border))]">{project.category}</span> : null}
        {project.status ? <span className="rounded-full px-2 py-1 ring-1 ring-[rgb(var(--color-border))]">{project.status}</span> : null}
        <span>{project.year}</span><span aria-hidden="true">•</span><span>{project.role}</span>
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-[rgb(var(--color-fg))] sm:text-5xl">{project.title}</h1>
      <p className="text-base leading-7 text-[rgb(var(--color-fg-muted))] sm:text-lg">{project.summary}</p>
      {caseStudy.context || (project.status && caseStudy.limitations?.length) ? <aside aria-label="Project status" className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-strong)/0.22)] p-4 text-sm leading-6 text-[rgb(var(--color-fg))]">{caseStudy.context ? <p>{caseStudy.context}</p> : null}{project.status && caseStudy.limitations?.length ? <ul className="mt-3 list-disc space-y-1 pl-5">{caseStudy.limitations.map((item) => <li key={item}>{item}</li>)}</ul> : null}</aside> : null}
      <div className="flex flex-wrap gap-3 pt-2">{project.display.showLiveLink && project.links.live ? <a href={project.links.live} target="_blank" rel="noreferrer" className="rounded-md border border-[rgb(var(--color-border))] px-3 py-2 text-sm text-[rgb(var(--color-fg))] sm:text-base">Live demo</a> : null}{project.display.showGithubLink && project.links.github ? <a href={project.links.github} target="_blank" rel="noreferrer" className="rounded-md border border-[rgb(var(--color-border))] px-3 py-2 text-sm text-[rgb(var(--color-fg))] sm:text-base">GitHub</a> : null}</div>
    </header>

    <figure className={["overflow-hidden rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface)/0.18)]", project.media.cover ? "" : "max-w-3xl"].join(" ")}><div data-project-media={project.media.cover ? "cover" : "fallback"} className={["relative w-full", project.media.cover ? "h-[320px] sm:h-[420px]" : "h-36 sm:h-52"].join(" ")}><ProjectMedia src={project.media.cover ?? undefined} title={project.title} alt={project.media.coverAlt} className={project.media.cover ? "object-cover" : undefined} priority sizes="(min-width: 768px) 70vw, 100vw" /></div></figure>

    {project.stack.length ? <section className="max-w-3xl space-y-3"><h2 className={sectionTitle}>Project snapshot</h2><div className="flex flex-wrap gap-2">{project.stack.map((item) => <span key={item} className="rounded-full px-3 py-1 text-xs ring-1 ring-[rgb(var(--color-border))] text-[rgb(var(--color-fg-muted))] sm:text-sm">{item}</span>)}</div></section> : null}

    <section className="max-w-4xl space-y-8" aria-labelledby="case-study-heading"><h2 id="case-study-heading" className="text-2xl font-semibold text-[rgb(var(--color-fg))] sm:text-3xl">Case study</h2>
      <TextSection title="Overview" text={caseStudy.overview} />
      <TextSection title="Challenge" text={caseStudy.challenge ?? caseStudy.problem} /><ListSection title="Objectives" items={caseStudy.objectives} /><ListSection title="Approach" items={caseStudy.approach} />
      <TextSection title="Solution" text={caseStudy.solution} /><ListSection title="Technical implementation" items={caseStudy.technicalImplementation} /><ListSection title="Accessibility" items={caseStudy.accessibility} /><ListSection title="Testing" items={caseStudy.testing} />
      <TextSection title="Result" text={caseStudy.result} /><ListSection title="Outcomes" items={caseStudy.outcomes} />
      {evidence?.length ? <section className="space-y-4 rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-strong)/0.22)] p-5"><h3 className={sectionTitle}>Evidence</h3>{evidence.map(([kind, items]) => <div key={kind}><h4 className="text-sm font-semibold capitalize text-[rgb(var(--color-fg))]">{kind}</h4><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-[rgb(var(--color-fg-muted))]">{items.map((item) => <li key={item}>{item}</li>)}</ul></div>)}</section> : null}
      <ListSection title="Limitations" items={project.status && caseStudy.limitations?.length ? undefined : caseStudy.limitations} tone /><ListSection title="Next steps" items={caseStudy.nextSteps} />
    </section>

    {gallery.length ? <section className="space-y-4"><h2 className={sectionTitle}>Screenshots</h2><div className="grid gap-4 sm:grid-cols-2">{gallery.map((src) => <figure key={src} className="overflow-hidden rounded-2xl border border-[rgb(var(--color-border))]"><div className="relative h-64 w-full"><ProjectMedia src={src} title={project.title} alt="" className="object-cover" sizes="(min-width: 640px) 35vw, 100vw" /></div></figure>)}</div></section> : null}
  </article>;
}
