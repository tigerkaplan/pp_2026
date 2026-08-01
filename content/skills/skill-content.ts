export const SKILL_STATUSES = [
  "applied",
  "practical-evidence",
  "developing-knowledge",
] as const;

export type SkillStatus = (typeof SKILL_STATUSES)[number];

export type SkillGroup = {
  id: string;
  label: string;
  order: number;
};

export type SkillContent = {
  id: string;
  name: string;
  group: string;
  status: SkillStatus;
  summary: string;
  order: number;
};
