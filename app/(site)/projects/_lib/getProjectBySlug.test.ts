import { getProjectBySlug } from "./getProjectBySlug";

test("resolves the two real Preview targets and rejects removed slugs", async () => {
  await expect(
    getProjectBySlug("council-digital-platforms-mini-lab"),
  ).resolves.toMatchObject({
    slug: "council-digital-platforms-mini-lab",
  });
  await expect(
    getProjectBySlug("seo-portfolio-platform"),
  ).resolves.toMatchObject({
    title: "Personal Portfolio 2026",
    slug: "seo-portfolio-platform",
  });
  await expect(getProjectBySlug("nextjs-ecommerce-platform")).resolves.toBeUndefined();
  await expect(getProjectBySlug("api-integration-service")).resolves.toBeUndefined();
  await expect(getProjectBySlug("not-a-real-project")).resolves.toBeUndefined();
});
