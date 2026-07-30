import {
  SKILL_STATUSES,
  type SkillContent,
  type SkillGroup,
} from "./skill-content";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function nonEmptyString(
  record: Record<string, unknown>,
  key: string,
  context: string,
): string {
  const value = record[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${context}: ${key} must be a non-empty string`);
  }
  return value;
}

function positiveInteger(
  record: Record<string, unknown>,
  key: string,
  context: string,
): number {
  const value = record[key];
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1) {
    throw new Error(`${context}: ${key} must be a positive integer`);
  }
  return value;
}

function rejectDuplicates<T>(
  items: readonly T[],
  selector: (item: T) => string | number,
  label: string,
) {
  const seen = new Set<string | number>();
  for (const item of items) {
    const value = selector(item);
    if (seen.has(value)) throw new Error(`Duplicate ${label}: ${value}`);
    seen.add(value);
  }
}

export function validateSkillGroups(value: unknown): SkillGroup[] {
  if (!Array.isArray(value)) {
    throw new Error("Skill groups must be an array");
  }
  const groups = value.map((item, index) => {
    const context = `Invalid skill group at index ${index}`;
    if (!isRecord(item)) throw new Error(`${context}: must be an object`);
    return {
      id: nonEmptyString(item, "id", context),
      label: nonEmptyString(item, "label", context),
      order: positiveInteger(item, "order", context),
    };
  });
  rejectDuplicates(groups, (group) => group.id, "skill group id");
  rejectDuplicates(groups, (group) => group.order, "skill group order");
  return [...groups].sort((left, right) => left.order - right.order);
}

export function validateSkills(
  value: unknown,
  groups: readonly SkillGroup[],
  source = "content/skills/skills.json",
): SkillContent[] {
  if (/skill\.template\.json$/i.test(source)) {
    throw new Error("Skill template must not be registered at runtime");
  }
  if (!Array.isArray(value)) throw new Error("Skills must be an array");

  const groupIds = new Set(groups.map((group) => group.id));
  const skills = value.map((item, index) => {
    const context = `Invalid skill at index ${index}`;
    if (!isRecord(item)) throw new Error(`${context}: must be an object`);
    const status = nonEmptyString(item, "status", context);
    if (!SKILL_STATUSES.includes(status as SkillContent["status"])) {
      throw new Error(`${context}: unsupported status "${status}"`);
    }
    const group = nonEmptyString(item, "group", context);
    if (!groupIds.has(group)) {
      throw new Error(`${context}: unknown group "${group}"`);
    }
    return {
      id: nonEmptyString(item, "id", context),
      name: nonEmptyString(item, "name", context),
      group,
      status: status as SkillContent["status"],
      summary: nonEmptyString(item, "summary", context),
      order: positiveInteger(item, "order", context),
    };
  });
  rejectDuplicates(skills, (skill) => skill.id, "skill id");
  rejectDuplicates(
    skills,
    (skill) => `${skill.group}:${skill.order}`,
    "skill order within group",
  );
  const groupOrders = new Map(groups.map((group) => [group.id, group.order]));
  return [...skills].sort(
    (left, right) =>
      groupOrders.get(left.group)! - groupOrders.get(right.group)! ||
      left.order - right.order,
  );
}
