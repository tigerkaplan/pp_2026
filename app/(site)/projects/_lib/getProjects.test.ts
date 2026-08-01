import { PROJECTS } from "./projects.data";
import { getProjects } from "./getProjects";

test("returns every validated registry record without evidence-based withholding", async () => {
  const projects = await getProjects();
  const slugs = projects.map((project) => project.slug);
  const genericProject = projects.find(
    (project) => project.slug === "nextjs-ecommerce-platform",
  );

  expect(projects).toBe(PROJECTS);
  expect(projects).toHaveLength(13);
  expect(new Set(slugs).size).toBe(13);
  expect(projects.filter((project) => project.featured).map((project) => project.slug)).toEqual([
    "council-digital-platforms-mini-lab",
    "seo-portfolio-platform",
  ]);
  expect(genericProject).toMatchObject({
    featured: false,
    media: { cover: null },
    links: {},
    display: {
      showLiveLink: false,
      showGithubLink: false,
      showPreview: true,
      showFullProject: true,
    },
  });
});
