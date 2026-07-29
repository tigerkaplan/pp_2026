import { getProjectBySlug } from "./getProjectBySlug";

test("resolves valid project slugs and rejects invalid ones", async () => {
  await expect(
    getProjectBySlug("seo-portfolio-platform"),
  ).resolves.toMatchObject({
    slug: "seo-portfolio-platform",
  });
  await expect(
    getProjectBySlug("not-a-real-project"),
  ).resolves.toBeUndefined();
});
