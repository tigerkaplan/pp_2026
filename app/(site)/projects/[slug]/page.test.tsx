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

jest.mock("../_lib/getProjectBySlug", () => ({
  getProjectBySlug: jest.fn(),
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

test("prebuilds the thirteen registered project routes", async () => {
  const params = await generateStaticParams();

  expect(dynamicParams).toBe(false);
  expect(params).toHaveLength(13);
  expect(params).toContainEqual({ slug: "council-digital-platforms-mini-lab" });
  expect(params).toContainEqual({ slug: "seo-portfolio-platform" });
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

test("renders Council as a standalone project without public links", async () => {
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
  expect(screen.getByText("Preview unavailable")).toBeInTheDocument();
  expect(container.querySelector('[data-project-media="fallback"]')).toHaveClass("h-36", "sm:h-52");
  expect(screen.queryByRole("link", { name: "Live demo" })).not.toBeInTheDocument();
  expect(screen.queryByRole("link", { name: "GitHub" })).not.toBeInTheDocument();
  expect(container.querySelector("img")).not.toBeInTheDocument();
});

test("renders the V9 Personal Portfolio as a standalone Full Project", async () => {
  const portfolio = PROJECTS.find(
    (candidate) => candidate.slug === "seo-portfolio-platform",
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
  expect(screen.queryByRole("link", { name: "Live demo" })).not.toBeInTheDocument();
  expect(container.querySelector('[data-project-media="fallback"]')).toBeInTheDocument();
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
