import type { Metadata } from "next";
import { SKILL_GROUPS, SKILLS } from "@/content/skills/skills.index";
import { SkillsEvidenceFilter } from "./SkillsEvidenceFilter";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "Documented front-end, accessible digital service, data, testing and platform skills with clear evidence levels.",
};

export default function SkillsPage() {
  return (
    <div className="max-w-5xl space-y-10">
      <header className="max-w-3xl space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight text-[rgb(var(--color-fg))] sm:text-5xl">Skills</h1>
        <p className="text-base leading-7 text-[rgb(var(--color-fg-muted))] sm:text-lg">Skills are grouped by the work they support and labelled to distinguish demonstrated practice from developing knowledge.</p>
      </header>
      <SkillsEvidenceFilter groups={SKILL_GROUPS} skills={SKILLS} />
    </div>
  );
}
