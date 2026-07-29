import rawGroups from "./skills.groups.json";
import rawSkills from "./skills.json";
import { SKILL_GROUPS, SKILL_IDS, SKILLS } from "./skills.index";
import { validateSkillGroups, validateSkills } from "./validate-skills";

test("publishes only the five approved skill groups and no unverified skills", () => {
  expect(SKILL_GROUPS.map(({ id, label }) => ({ id, label }))).toEqual([
    {
      id: "front-end-development",
      label: "Front-end Development",
    },
    {
      id: "accessible-digital-services",
      label: "Accessible Digital Services",
    },
    {
      id: "data-integration",
      label: "Data & Integration",
    },
    {
      id: "testing-delivery",
      label: "Testing & Delivery",
    },
    {
      id: "platforms-interoperability",
      label: "Platforms & Interoperability Knowledge",
    },
  ]);
  expect(SKILLS).toEqual([]);
  expect(SKILL_IDS.size).toBe(0);
  expect(validateSkills(rawSkills, validateSkillGroups(rawGroups))).toEqual([]);
});

test("rejects unknown groups, unsupported statuses and skill templates", () => {
  const baseSkill = {
    id: "example-skill",
    name: "Example skill",
    group: "testing-delivery",
    status: "practical-evidence",
    summary: "Verified summary.",
    order: 1,
  };

  expect(() =>
    validateSkills(
      [{ ...baseSkill, group: "unknown-group" }],
      SKILL_GROUPS,
    ),
  ).toThrow('unknown group "unknown-group"');
  expect(() =>
    validateSkills(
      [{ ...baseSkill, status: "percentage-80" }],
      SKILL_GROUPS,
    ),
  ).toThrow('unsupported status "percentage-80"');
  expect(() =>
    validateSkills(
      [baseSkill],
      SKILL_GROUPS,
      "content/templates/skill.template.json",
    ),
  ).toThrow("template must not be registered");
});
