import sitemap from "./sitemap";

test("includes every valid project in the sitemap data source", async () => {
  const entries = await sitemap();

  const projectEntries = entries.filter((entry) =>
    entry.url.includes("/projects/"),
  );

  expect(projectEntries).toHaveLength(4);

  expect(entries).toContainEqual(
    expect.objectContaining({
      url: "http://localhost:3000/projects/council-digital-platforms-mini-lab",
    }),
  );
  expect(entries).toContainEqual(
    expect.objectContaining({ url: "http://localhost:3000/skills" }),
  );
  expect(entries).toContainEqual(
    expect.objectContaining({
      url: "http://localhost:3000/projects/personal-portfolio-2026",
    }),
  );
  expect(entries).toContainEqual(
    expect.objectContaining({
      url: "http://localhost:3000/projects/clive-lutley-painting-gallery",
    }),
  );
  expect(entries).toContainEqual(
    expect.objectContaining({
      url: "http://localhost:3000/projects/bakery-project",
    }),
  );
  expect(entries).not.toContainEqual(
    expect.objectContaining({
      url: "http://localhost:3000/projects/nextjs-ecommerce-platform",
    }),
  );
  expect(entries).not.toContainEqual(
    expect.objectContaining({
      url: "http://localhost:3000/projects/seo-portfolio-platform",
    }),
  );
});
