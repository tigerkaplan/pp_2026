"use client";

import { useState } from "react";
import type { SkillContent, SkillGroup } from "@/content/skills/skill-content";

type EvidenceFilter = "all" | "demonstrated" | "developing-knowledge";

type SkillsEvidenceFilterProps = {
  groups: readonly SkillGroup[];
  skills: readonly SkillContent[];
};

const FILTERS: ReadonlyArray<{ id: EvidenceFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "demonstrated", label: "Demonstrated" },
  { id: "developing-knowledge", label: "Developing knowledge" },
];

function isVisible(skill: SkillContent, filter: EvidenceFilter) {
  if (filter === "all") return true;
  if (filter === "demonstrated") return skill.status !== "developing-knowledge";
  return skill.status === "developing-knowledge";
}

function publicStatus(status: SkillContent["status"]) {
  return status === "developing-knowledge" ? "Developing knowledge" : "Demonstrated";
}

export function SkillsEvidenceFilter({ groups, skills }: SkillsEvidenceFilterProps) {
  const [activeFilter, setActiveFilter] = useState<EvidenceFilter>("all");

  return (
    <>
      <fieldset className="flex flex-wrap items-center gap-2" aria-controls="skills-results">
        <legend className="mb-2 text-sm font-medium text-[rgb(var(--color-fg))]">Filter by evidence level</legend>
        {FILTERS.map((filter) => {
          const isActive = filter.id === activeFilter;
          return (
            <button
              key={filter.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveFilter(filter.id)}
              className={`min-h-11 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgb(var(--color-fg))] ${isActive ? "border-[rgb(var(--color-fg))] bg-[rgb(var(--color-fg))] text-[rgb(var(--color-bg))]" : "border-[rgb(var(--color-border))] text-[rgb(var(--color-fg))] hover:bg-[rgb(var(--color-surface-strong)/0.32)]"}`}
            >
              {filter.label}
            </button>
          );
        })}
      </fieldset>

      <div id="skills-results" className="space-y-10">
        {groups.map((group) => {
          const visibleSkills = skills.filter(
            (skill) => skill.group === group.id && isVisible(skill, activeFilter),
          );
          if (!visibleSkills.length) return null;

          return (
            <section key={group.id} className="space-y-4" aria-labelledby={`${group.id}-heading`}>
              <h2 id={`${group.id}-heading`} className="text-2xl font-semibold text-[rgb(var(--color-fg))]">{group.label}</h2>
              <ul className="grid gap-4 md:grid-cols-2" role="list">
                {visibleSkills.map((skill) => (
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
    </>
  );
}
