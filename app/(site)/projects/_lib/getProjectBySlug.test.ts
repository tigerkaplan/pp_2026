import { getProjectBySlug } from "./getProjectBySlug";

test("resolves the three real Preview targets and rejects removed slugs", async () => {
  await expect(
    getProjectBySlug("council-digital-platforms-mini-lab"),
  ).resolves.toMatchObject({
    slug: "council-digital-platforms-mini-lab",
  });
  await expect(
    getProjectBySlug("personal-portfolio-2026"),
  ).resolves.toMatchObject({
    title: "Personal Portfolio 2026",
    slug: "personal-portfolio-2026",
  });
  await expect(
    getProjectBySlug("clive-lutley-painting-gallery"),
  ).resolves.toMatchObject({
    title: "Clive Lutley Painting Gallery",
    slug: "clive-lutley-painting-gallery",
  });
  await expect(getProjectBySlug("nextjs-ecommerce-platform")).resolves.toBeUndefined();
  await expect(getProjectBySlug("api-integration-service")).resolves.toBeUndefined();
  await expect(getProjectBySlug("seo-portfolio-platform")).resolves.toBeUndefined();
  await expect(getProjectBySlug("not-a-real-project")).resolves.toBeUndefined();
});
