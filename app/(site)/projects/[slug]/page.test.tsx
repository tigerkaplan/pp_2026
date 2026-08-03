import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import ProjectPage, {
  dynamicParams,
  generateMetadata,
  generateStaticParams,
} from "./page";
import { getProjectBySlug } from "../_lib/getProjectBySlug";
import { PROJECTS } from "../_lib/projects.data";
import type { Project } from "../_types/project";
import { notFound } from "next/navigation";

jest.mock("../_lib/getProjectBySlug", () => ({
  getProjectBySlug: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img {...props} />
  ),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props}>{children}</a>
  ),
}));

const project: Project = {
  id: 1,
  slug: "missing-media-project",
  title: "Missing media project",
  summary: "A project whose local media is unavailable.",
  featured: true,
  year: 2026,
  role: "Developer",
  stack: ["Next.js"],
  tags: ["Accessibility"],
  problem: "Problem",
  solution: "Solution",
  result: "Result",
  features: ["Safe media"],
  images: [],
  links: {},
  media: { cover: null, coverAlt: "", gallery: [] },
  caseStudy: { problem: "Problem", solution: "Solution", result: "Result" },
  display: { showLiveLink: false, showGithubLink: false, showPreview: true, showFullProject: true },
};

test("prebuilds every valid registered project route", async () => {
  const params = await generateStaticParams();

  expect(dynamicParams).toBe(false);
  expect(params).toHaveLength(3);
  expect(params).toContainEqual({ slug: "council-digital-platforms-mini-lab" });
  expect(params).toContainEqual({ slug: "personal-portfolio-2026" });
  expect(params).toContainEqual({ slug: "clive-lutley-painting-gallery" });
  expect(params).not.toContainEqual({ slug: "seo-portfolio-platform" });
  expect(params).not.toContainEqual({ slug: "nextjs-ecommerce-platform" });
  expect(params).not.toContainEqual({ slug: "not-a-real-project" });
});

test("maps Council metadata from approved JSON content", async () => {
  const council = PROJECTS.find(
    (candidate) => candidate.slug === "council-digital-platforms-mini-lab",
  ) as Project;
  jest.mocked(getProjectBySlug).mockResolvedValue(council);

  await expect(
    generateMetadata({ params: Promise.resolve({ slug: council.slug }) }),
  ).resolves.toMatchObject({
    title: "Council Digital Platforms Mini Lab | Projects",
    description:
      "A council-style digital-service prototype using Drupal Webform, conditional logic, PHP postcode validation and structured JSON data.",
  });
});

test("renders Council as a standalone project with verified public links", async () => {
  const council = PROJECTS.find(
    (candidate) => candidate.slug === "council-digital-platforms-mini-lab",
  ) as Project;
  jest.mocked(getProjectBySlug).mockResolvedValue(council);

  const { container } = render(
    await ProjectPage({ params: Promise.resolve({ slug: council.slug }) }),
  );

  expect(getProjectBySlug).toHaveBeenCalledWith(council.slug);
  expect(screen.getByRole("heading", { name: council.title, level: 1 })).toBeInTheDocument();
  expect(screen.getByText("In progress")).toBeInTheDocument();
  expect(screen.getByText("Accessible Digital Service")).toBeInTheDocument();
  expect(screen.getAllByText(/fictional service data rather than a live council service/i)).toHaveLength(1);
  expect(screen.getByText(/Final browser-based accessibility evidence is still being completed/i)).toBeInTheDocument();
  expect(screen.getByText(/Final internal staff view and accessibility evidence are still being completed/i)).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Case study", level: 2 })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Result", level: 3 })).toBeInTheDocument();
  expect(screen.getAllByRole("heading", { name: "Outcomes", level: 3 })).toHaveLength(1);
  expect(screen.queryByRole("heading", { name: "Screenshots" })).not.toBeInTheDocument();
  expect(screen.getByAltText("Council Digital Platforms Mini Lab case study overview page")).toHaveAttribute(
    "src",
    "/images/projects/council-digital-platforms-mini-lab/cover.png",
  );
  expect(container.querySelector('[data-project-media="cover"]')).toHaveClass("h-[320px]", "sm:h-[420px]");
  const live = screen.getByRole("link", { name: "Live demo" });
  const github = screen.getByRole("link", { name: "GitHub" });
  expect(live).toHaveAttribute("href", "https://council-digital-platforms-mini-lab.netlify.app/");
  expect(live).toHaveAttribute("target", "_blank");
  expect(live).toHaveAttribute("rel", "noreferrer");
  expect(github).toHaveAttribute("href", "https://github.com/tigerkaplan/council-digital-platforms-mini-lab");
  expect(github).toHaveAttribute("target", "_blank");
  expect(github).toHaveAttribute("rel", "noreferrer");
  expect(container.querySelector("img")).toBeInTheDocument();
});

test("renders a temporary non-featured project through the generic full-page path", async () => {
  const futureProject: Project = {
    ...project,
    slug: "future-project",
    title: "Future project",
    featured: false,
  };
  jest.mocked(getProjectBySlug).mockResolvedValue(futureProject);

  const { container } = render(
    await ProjectPage({ params: Promise.resolve({ slug: futureProject.slug }) }),
  );

  expect(screen.getByRole("heading", { name: futureProject.title, level: 1 })).toBeInTheDocument();
  expect(screen.getByText("Preview unavailable")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Case study", level: 2 })).toBeInTheDocument();
  expect(screen.queryByRole("link", { name: "Live demo" })).not.toBeInTheDocument();
  expect(screen.queryByRole("link", { name: "GitHub" })).not.toBeInTheDocument();
  expect(container.querySelector('[data-project-media="fallback"]')).toBeInTheDocument();
});

test("uses the normal not-found behaviour for the previous Personal Portfolio slug", async () => {
  jest.mocked(getProjectBySlug).mockResolvedValue(undefined);

  await expect(
    ProjectPage({ params: Promise.resolve({ slug: "seo-portfolio-platform" }) }),
  ).rejects.toThrow("NEXT_NOT_FOUND");
  expect(notFound).toHaveBeenCalled();
});

test("renders Personal Portfolio as a standalone Full Project with approved media", async () => {
  const portfolio = PROJECTS.find(
    (candidate) => candidate.slug === "personal-portfolio-2026",
  ) as Project;
  jest.mocked(getProjectBySlug).mockResolvedValue(portfolio);

  const { container } = render(
    await ProjectPage({ params: Promise.resolve({ slug: portfolio.slug }) }),
  );

  expect(getProjectBySlug).toHaveBeenCalledWith(portfolio.slug);
  expect(screen.getByRole("heading", { name: "Personal Portfolio 2026", level: 1 })).toBeInTheDocument();
  expect(screen.getByText("Personal Product")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Case study", level: 2 })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
    "href",
    "https://github.com/tigerkaplan/pp_2026",
  );
  expect(screen.getByRole("link", { name: "Live demo" })).toHaveAttribute(
    "href",
    "https://husniyeerparundev.netlify.app/",
  );
  expect(screen.getByAltText("Personal Portfolio 2026 homepage showing navigation, featured projects and project cards")).toHaveAttribute(
    "src",
    "/images/projects/personal-portfolio-2026/homepage.png",
  );
  expect(container.querySelector('[data-project-media="cover"]')).toBeInTheDocument();
});

test("renders Clive Lutley Painting Gallery as a standalone Full Project with its approved media", async () => {
  const clive = PROJECTS.find(
    (candidate) => candidate.slug === "clive-lutley-painting-gallery",
  ) as Project;
  jest.mocked(getProjectBySlug).mockResolvedValue(clive);

  const { container } = render(
    await ProjectPage({ params: Promise.resolve({ slug: clive.slug }) }),
  );

  expect(getProjectBySlug).toHaveBeenCalledWith(clive.slug);
  expect(screen.getByRole("heading", { name: clive.title, level: 1 })).toBeInTheDocument();
  expect(screen.getByText("Artist Portfolio & Gallery")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Screenshots", level: 2 })).toBeInTheDocument();
  expect(screen.getByAltText("English homepage showing the Clive Lutley logo, artist portrait, navigation and gallery call to action.")).toHaveAttribute(
    "src",
    "/images/projects/clive-lutley-painting-gallery/cover.png",
  );
  expect(screen.getByRole("link", { name: "Live demo" })).toHaveAttribute(
    "href",
    "https://cl-painting-gallery.netlify.app",
  );
  expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
    "href",
    "https://github.com/tigerkaplan/cl-painting-gallery",
  );
  expect(container.querySelectorAll("img")).toHaveLength(4);
});

test("maps Clive Lutley Painting Gallery metadata from approved JSON content", async () => {
  const clive = PROJECTS.find(
    (candidate) => candidate.slug === "clive-lutley-painting-gallery",
  ) as Project;
  jest.mocked(getProjectBySlug).mockResolvedValue(clive);

  await expect(
    generateMetadata({ params: Promise.resolve({ slug: clive.slug }) }),
  ).resolves.toMatchObject({
    title: "Clive Lutley Painting Gallery | Projects",
    description:
      "A multilingual Next.js artist portfolio and painting gallery with English and German routes, artwork, events and artist information.",
  });
});

test("maps normalized project fields into route metadata", async () => {
  jest.mocked(getProjectBySlug).mockResolvedValue(project);

  await expect(
    generateMetadata({ params: Promise.resolve({ slug: project.slug }) }),
  ).resolves.toMatchObject({
    title: `${project.title} | Projects`,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${project.title} | Projects`,
      description: project.summary,
    },
  });
});

test("keeps the large media structure for a project with a cover path", async () => {
  const projectWithCover: Project = {
    ...project,
    slug: "project-with-cover",
    media: { cover: "/images/projects/test-cover.png", coverAlt: "Test project cover" , gallery: [] },
  };
  jest.mocked(getProjectBySlug).mockResolvedValue(projectWithCover);

  const { container } = render(
    await ProjectPage({ params: Promise.resolve({ slug: projectWithCover.slug }) }),
  );

  expect(container.querySelector('[data-project-media="cover"]')).toHaveClass(
    "h-[320px]",
    "sm:h-[420px]",
  );
  expect(screen.getByRole("heading", { name: projectWithCover.title, level: 1 })).toBeInTheDocument();
});

test("uses semantic fallbacks for missing full-page project media", async () => {
  jest.mocked(getProjectBySlug).mockResolvedValue(project);

  const { container } = render(
    await ProjectPage({ params: Promise.resolve({ slug: project.slug }) }),
  );

  expect(screen.getByRole("heading", { name: project.title, level: 1 })).toBeInTheDocument();
  expect(screen.getAllByText("Preview unavailable")).toHaveLength(1);
  expect(screen.getAllByText(project.title).length).toBeGreaterThan(1);
  expect(container.querySelector("img")).not.toBeInTheDocument();
  expect(container.querySelector('[data-project-media="fallback"]')).toHaveClass("h-36", "sm:h-52");
  expect(screen.queryByRole("heading", { name: "Screenshots" })).not.toBeInTheDocument();
  expect(screen.queryByRole("link", { name: /back to projects/i })).not.toBeInTheDocument();
  expect(await axe(container)).toHaveNoViolations();
});
