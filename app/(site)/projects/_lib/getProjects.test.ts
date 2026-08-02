import { PROJECTS } from "./projects.data";
import { getProjects } from "./getProjects";

test("returns every validated registry record without evidence-based withholding", async () => {
  const projects = await getProjects();
  const slugs = projects.map((project) => project.slug);

  expect(projects).toBe(PROJECTS);
  expect(projects).toHaveLength(2);
  expect(new Set(slugs).size).toBe(2);
  expect(slugs).toEqual([
    "council-digital-platforms-mini-lab",
    "personal-portfolio-2026",
  ]);
  expect(projects[0]).toMatchObject({
    media: { cover: null },
    links: {
      live: "https://council-digital-platforms-mini-lab.netlify.app/",
      github: "https://github.com/tigerkaplan/council-digital-platforms-mini-lab",
    },
    display: {
      showLiveLink: true,
      showGithubLink: true,
      showPreview: true,
      showFullProject: true,
    },
  });
});
