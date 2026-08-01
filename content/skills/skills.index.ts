import rawGroups from "./skills.groups.json";
import rawSkills from "./skills.json";
import { validateSkillGroups, validateSkills } from "./validate-skills";

export const SKILL_GROUPS = validateSkillGroups(rawGroups);
export const SKILLS = validateSkills(rawSkills, SKILL_GROUPS);
export const SKILL_IDS: ReadonlySet<string> = new Set(
  SKILLS.map((skill) => skill.id),
);
