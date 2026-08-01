import { getPublishedProjects } from "./getProjects";

test("publishes only project records with approved evidence", async () => {
  const projects = await getPublishedProjects();

  expect(projects.map((project) => project.slug)).toEqual([
    "council-digital-platforms-mini-lab",
    "seo-portfolio-platform",
  ]);
  expect(projects.every((project) => project.evidence)).toBe(true);
  expect(projects.some((project) => project.slug === "nextjs-ecommerce-platform")).toBe(false);
});
