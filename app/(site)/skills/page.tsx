import type { Metadata } from "next";
import { SKILL_GROUPS, SKILLS } from "@/content/skills/skills.index";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "Documented front-end, accessible digital service, data, testing and platform skills with clear evidence levels.",
};

function publicStatus(status: (typeof SKILLS)[number]["status"]) {
  return status === "developing-knowledge" ? "Developing knowledge" : "Demonstrated";
}

export default function SkillsPage() {
  return (
    <div className="max-w-5xl space-y-10">
      <header className="max-w-3xl space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight text-[rgb(var(--color-fg))] sm:text-5xl">Skills</h1>
        <p className="text-base leading-7 text-[rgb(var(--color-fg-muted))] sm:text-lg">Skills are grouped by the work they support and labelled to distinguish demonstrated practice from developing knowledge.</p>
      </header>
      {SKILL_GROUPS.filter((group) => SKILLS.some((skill) => skill.group === group.id)).map((group) => {
        const skills = SKILLS.filter((skill) => skill.group === group.id);
        return (
          <section key={group.id} className="space-y-4" aria-labelledby={`${group.id}-heading`}>
            <h2 id={`${group.id}-heading`} className="text-2xl font-semibold text-[rgb(var(--color-fg))]">{group.label}</h2>
            <ul className="grid gap-4 md:grid-cols-2" role="list">
              {skills.map((skill) => (
                <li key={skill.id} className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface)/0.18)] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="font-semibold text-[rgb(var(--color-fg))]">{skill.name}</h3>
                    <span className="rounded-full border border-[rgb(var(--color-border))] px-2 py-1 text-xs font-medium text-[rgb(var(--color-fg-muted))]">{publicStatus(skill.status)}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[rgb(var(--color-fg-muted))]">{skill.summary}</p>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
