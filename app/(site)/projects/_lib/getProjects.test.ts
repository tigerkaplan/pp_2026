import { PROJECTS } from "./projects.data";
import { getProjects } from "./getProjects";

test("returns every validated registry record without evidence-based withholding", async () => {
  const projects = await getProjects();
  const slugs = projects.map((project) => project.slug);

  expect(projects).toBe(PROJECTS);
  expect(projects).toHaveLength(3);
  expect(new Set(slugs).size).toBe(3);
  expect(slugs).toEqual([
    "council-digital-platforms-mini-lab",
    "personal-portfolio-2026",
    "clive-lutley-painting-gallery",
  ]);
  expect(projects[0]).toMatchObject({
    media: {
      cover: "/images/projects/council-digital-platforms-mini-lab/cover.png",
      coverAlt: "Council Digital Platforms Mini Lab case study overview page",
    },
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
  expect(projects[2]).toMatchObject({
    slug: "clive-lutley-painting-gallery",
    featured: false,
    media: {
      cover: "/images/projects/clive-lutley-painting-gallery/cover.png",
    },
    links: {
      live: "https://cl-painting-gallery.netlify.app",
      github: "https://github.com/tigerkaplan/cl-painting-gallery",
    },
  });
});
