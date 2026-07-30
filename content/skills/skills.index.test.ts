import rawGroups from "./skills.groups.json";
import rawSkills from "./skills.json";
import { SKILL_GROUPS, SKILL_IDS, SKILLS } from "./skills.index";
import { validateSkillGroups, validateSkills } from "./validate-skills";

const APPROVED_SKILL_IDS = [
  "accessible-form-design",
  "conditional-form-logic",
  "server-side-validation",
  "plain-language-form-design",
  "keyboard-accessibility",
  "structured-data-capture",
  "json",
  "rest-style-endpoints",
  "technical-documentation",
  "drupal",
  "drupal-webform",
  "php",
  "twig",
  "yaml-configuration",
];

test("publishes the five approved groups and fourteen approved skills", () => {
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
  expect(SKILLS).toHaveLength(14);
  expect(SKILLS.map((skill) => skill.id)).toEqual(APPROVED_SKILL_IDS);
  expect(SKILL_IDS.size).toBe(14);
  expect(validateSkills(rawSkills, validateSkillGroups(rawGroups))).toEqual(
    SKILLS,
  );
  expect(
    SKILLS.map(({ id, group, status }) => ({ id, group, status })),
  ).toEqual([
    { id: "accessible-form-design", group: "accessible-digital-services", status: "practical-evidence" },
    { id: "conditional-form-logic", group: "accessible-digital-services", status: "practical-evidence" },
    { id: "server-side-validation", group: "accessible-digital-services", status: "practical-evidence" },
    { id: "plain-language-form-design", group: "accessible-digital-services", status: "practical-evidence" },
    { id: "keyboard-accessibility", group: "accessible-digital-services", status: "developing-knowledge" },
    { id: "structured-data-capture", group: "data-integration", status: "practical-evidence" },
    { id: "json", group: "data-integration", status: "practical-evidence" },
    { id: "rest-style-endpoints", group: "data-integration", status: "practical-evidence" },
    { id: "technical-documentation", group: "testing-delivery", status: "applied" },
    { id: "drupal", group: "platforms-interoperability", status: "practical-evidence" },
    { id: "drupal-webform", group: "platforms-interoperability", status: "practical-evidence" },
    { id: "php", group: "platforms-interoperability", status: "practical-evidence" },
    { id: "twig", group: "platforms-interoperability", status: "developing-knowledge" },
    { id: "yaml-configuration", group: "platforms-interoperability", status: "practical-evidence" },
  ]);
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

test("permits group-local order values but rejects duplicates within one group", () => {
  const first = {
    id: "first-skill",
    name: "First skill",
    group: "accessible-digital-services",
    status: "applied",
    summary: "First verified skill.",
    order: 1,
  };
  const otherGroup = { ...first, id: "other-skill", group: "data-integration" };

  expect(validateSkills([first, otherGroup], SKILL_GROUPS)).toHaveLength(2);
  expect(() =>
    validateSkills(
      [first, { ...first, id: "duplicate-skill" }],
      SKILL_GROUPS,
    ),
  ).toThrow("Duplicate skill order within group");
});
