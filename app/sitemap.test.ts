import sitemap from "./sitemap";

test("includes Council in the sitemap data source", async () => {
  const entries = await sitemap();

  expect(entries).toContainEqual(
    expect.objectContaining({
      url: "http://localhost:3000/projects/council-digital-platforms-mini-lab",
    }),
  );
});
