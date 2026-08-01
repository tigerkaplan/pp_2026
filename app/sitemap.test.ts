import sitemap from "./sitemap";

test("includes every valid project in the sitemap data source", async () => {
  const entries = await sitemap();

  const projectEntries = entries.filter((entry) =>
    entry.url.includes("/projects/"),
  );

  expect(projectEntries).toHaveLength(13);

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
      url: "http://localhost:3000/projects/nextjs-ecommerce-platform",
    }),
  );
});
