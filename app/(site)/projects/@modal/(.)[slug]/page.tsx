// app/(site)/projects/@modal/(.)[slug]/page.tsx
import { notFound } from "next/navigation";
import ModalShell from "@/components/ModalShell";
import { getProjectBySlug } from "../../_lib/getProjectBySlug";
import BackToProjectsButton from "../../_components/BackToProjectsButton";
import OpenRevealButton from "../../_components/OpenRevealButton";

type Props = { params: Promise<{ slug: string }> };

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className={[
        "rounded-full px-2 py-1 text-xs ring-1 backdrop-blur",
        "bg-[rgb(var(--color-surface)/0.22)]",
        "text-[rgb(var(--color-modal-fg-muted))]",
        "ring-[rgb(var(--color-modal-border))]",
      ].join(" ")}
    >
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
    <div
      className={[
        "rounded-xl border p-4",
        "border-[rgb(var(--color-modal-border))]",
        "bg-[rgb(var(--color-surface)/0.18)]",
      ].join(" ")}
    >
      <div className="text-xs font-medium text-[rgb(var(--color-modal-fg-muted))]">
        {label}
      </div>
      <div className="mt-2 text-sm text-[rgb(var(--color-modal-fg))]">
        {value}
      </div>
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
        <span className="inline-flex flex-wrap items-center gap-2 text-[rgb(var(--color-modal-fg-muted))]">
          <span className="text-[rgb(var(--color-modal-fg))]">{project.year}</span>
          <span className="opacity-60">•</span>
          <span className="text-[rgb(var(--color-modal-fg))]">{project.role}</span>

          {project.featured ? (
            <>
              <span className="opacity-60">•</span>
              <span
                className={[
                  "rounded-full px-2 py-0.5 text-xs ring-1",
                  "bg-[rgb(var(--color-nav-active))/0.18]",
                  "text-[rgb(var(--color-modal-fg))]",
                  "ring-[rgb(var(--color-modal-border))]",
                ].join(" ")}
              >
                Featured
              </span>
            </>
          ) : null}
        </span>
      }
      actions={<OpenRevealButton href={fullUrl} />}
    >
      {/* SUMMARY */}
      <p className="text-sm leading-relaxed text-[rgb(var(--color-modal-fg))]">
        {project.summary}
      </p>

      {/* TAGS + STACK */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {tags.map((t) => (
          <Badge key={t}>{t}</Badge>
        ))}

        {tags.length > 0 && stack.length > 0 ? (
          <span className="mx-1 text-[rgb(var(--color-modal-border))]">|</span>
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
          <div className="text-sm font-semibold text-[rgb(var(--color-modal-fg))]">
            Highlights
          </div>

          <ul className="mt-3 grid gap-2 md:grid-cols-2">
            {highlights.map((h) => (
              <li
                key={h}
                className={[
                  "rounded-lg border px-3 py-2 text-sm",
                  "border-[rgb(var(--color-modal-border))]",
                  "bg-[rgb(var(--color-surface)/0.18)]",
                  "text-[rgb(var(--color-modal-fg))]",
                ].join(" ")}
              >
                {h}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* LINKS + BACK */}
      <div
        className={[
          "mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-4",
          "border-[rgb(var(--color-modal-border))]",
        ].join(" ")}
      >
        <BackToProjectsButton />

        <div className="flex flex-wrap gap-2">
          <a
            href={github || "#"}
            target="_blank"
            rel="noreferrer"
            aria-disabled={!github}
            className={[
              "rounded-md border px-3 py-2 text-sm transition",
              "border-[rgb(var(--color-modal-border))]",
              github
                ? [
                    "text-[rgb(var(--color-modal-fg))]",
                    "hover:bg-[rgb(var(--color-surface)/0.25)]",
                  ].join(" ")
                : "pointer-events-none opacity-50 text-[rgb(var(--color-modal-fg-muted))]",
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
              "rounded-md px-3 py-2 text-sm font-medium transition",
              live
                ? [
                    "bg-[rgb(var(--color-nav-active))]",
                    "text-[rgb(var(--color-nav-active-fg))]",
                    "hover:opacity-90",
                  ].join(" ")
                : [
                    "pointer-events-none opacity-50",
                    "bg-[rgb(var(--color-surface)/0.25)]",
                    "text-[rgb(var(--color-modal-fg-muted))]",
                    "ring-1 ring-[rgb(var(--color-modal-border))]",
                  ].join(" "),
            ].join(" ")}
          >
            Live
          </a>
        </div>
      </div>

      {/* OPTIONAL: small note */}
      <p className="mt-4 text-xs text-[rgb(var(--color-modal-fg-muted))]">
        Tip: Press ESC or click outside to close. Use “View full case study” for the SEO page.
      </p>
    </ModalShell>
  );
}
