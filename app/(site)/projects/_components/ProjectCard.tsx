import Link from "next/link";
import type { Project } from "../_types/project";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group relative rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md">
      
      {/* SPA navigation – intercept buradan çalışır */}
      <Link
        href={`/projects/${project.slug}`}
        scroll={false}
        className="absolute inset-0 z-30"
        aria-label={`Open project ${project.title}`}
      />

      {/* 👇 BÜTÜN içerik click-through */}
      <div className="relative z-20 pointer-events-none">
        <h3 className="text-base font-semibold">{project.title}</h3>

        <p className="mt-2 text-sm text-neutral-600">
          {project.summary}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.stack.map((t) => (
            <span
              key={t}
              className="rounded-full bg-neutral-100 px-2 py-1 text-xs"
            >
              {t}
            </span>
          ))}
        </div>

        <span className="mt-4 inline-block text-sm font-medium text-blue-700">
          View details →
        </span>
      </div>
    </article>
  );
}
