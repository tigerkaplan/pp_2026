// app/(site)/projects/@modal/(.)[slug]/page.tsx
import { notFound } from "next/navigation";
import ModalShell from "@/components/ModalShell";
import { getProjectBySlug } from "../../_lib/getProjectBySlug";
import BackToProjectsButton from "../../_components/BackToProjectsButton";
import OpenRevealButton from "../../_components/OpenRevealButton";

type Props = { params: Promise<{ slug: string }> };

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-white/5 px-2 py-1 text-xs text-white/80 ring-1 ring-white/10">
      {children}
    </span>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs font-medium text-white/60">{label}</div>
      <div className="mt-2 text-sm text-white/85">{value}</div>
    </div>
  );
}

export default async function ProjectModal({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const fullUrl = `/projects/${project.slug}`;

  const github = project.links?.github?.trim();
  const live = project.links?.live?.trim();

  const stack = (project.stack ?? []).slice(0, 10);
  const tags = (project.tags ?? []).slice(0, 6);
  const highlights = (project.features ?? []).slice(0, 6);

  return (
    <ModalShell
      title={project.title}
      subtitle={
        <span className="inline-flex flex-wrap items-center gap-2">
          <span>{project.year}</span>
          <span className="opacity-60">•</span>
          <span>{project.role}</span>
          {project.featured ? (
            <>
              <span className="opacity-60">•</span>
              <span className="rounded-full bg-yellow-400/15 px-2 py-0.5 text-xs text-yellow-200 ring-1 ring-yellow-400/20">
                Featured
              </span>
            </>
          ) : null}
        </span>
      }
      actions={<OpenRevealButton href={fullUrl} />}
    >
      {/* SUMMARY */}
      <p className="text-sm text-white/75 leading-relaxed">
        {project.summary}
      </p>

      {/* TAGS + STACK */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {tags.map((t) => (
          <Badge key={t}>{t}</Badge>
        ))}
        {tags.length > 0 && stack.length > 0 ? (
          <span className="mx-1 text-white/20">|</span>
        ) : null}
        {stack.map((s) => (
          <Badge key={s}>{s}</Badge>
        ))}
      </div>

      {/* PROBLEM / SOLUTION / RESULT */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <StatCard label="Problem" value={project.problem} />
        <StatCard label="Solution" value={project.solution} />
        <StatCard label="Result" value={project.result} />
      </div>

      {/* HIGHLIGHTS */}
      {highlights.length > 0 ? (
        <div className="mt-6">
          <div className="text-sm font-semibold text-white">
            Highlights
          </div>
          <ul className="mt-3 grid gap-2 md:grid-cols-2">
            {highlights.map((h) => (
              <li
                key={h}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/85"
              >
                {h}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* LINKS + BACK */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
        <BackToProjectsButton />

        <div className="flex flex-wrap gap-2">
          <a
            href={github || "#"}
            target="_blank"
            rel="noreferrer"
            aria-disabled={!github}
            className={[
              "rounded-md border border-white/10 px-3 py-2 text-sm",
              github
                ? "text-white/80 hover:bg-white/5 hover:text-white"
                : "pointer-events-none text-white/30 opacity-50",
            ].join(" ")}
          >
            GitHub
          </a>

          <a
            href={live || "#"}
            target="_blank"
            rel="noreferrer"
            aria-disabled={!live}
            className={[
              "rounded-md px-3 py-2 text-sm font-medium",
              live
                ? "bg-white text-neutral-900 hover:opacity-90"
                : "pointer-events-none bg-white/20 text-white/30 opacity-50",
            ].join(" ")}
          >
            Live
          </a>
        </div>
      </div>

      {/* OPTIONAL: small note */}
      <p className="mt-4 text-xs text-white/45">
        Tip: Press ESC or click outside to close. Use “View full case study” for the SEO page.
      </p>
    </ModalShell>
  );
}
