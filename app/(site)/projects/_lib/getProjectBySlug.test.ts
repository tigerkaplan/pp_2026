import { getProjectBySlug } from "./getProjectBySlug";

test("resolves the real Preview targets and rejects unavailable slugs", async () => {
  await expect(
    getProjectBySlug("council-digital-platforms-mini-lab"),
  ).resolves.toMatchObject({
    slug: "council-digital-platforms-mini-lab",
  });
  await expect(
    getProjectBySlug("not-a-real-project"),
  ).resolves.toBeUndefined();
  await expect(
    getProjectBySlug("seo-portfolio-platform"),
  ).resolves.toMatchObject({
    title: "Personal Portfolio 2026",
    slug: "seo-portfolio-platform",
  });
});
