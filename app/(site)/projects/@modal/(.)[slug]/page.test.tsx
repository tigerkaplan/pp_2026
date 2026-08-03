import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import ProjectModal from "./page";
import { getProjectBySlug } from "../../_lib/getProjectBySlug";
import { PROJECTS } from "../../_lib/projects.data";
import type { Project } from "../../_types/project";
import { notFound } from "next/navigation";

jest.mock("../../_lib/getProjectBySlug", () => ({
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

jest.mock("@/components/ModalShell", () => ({
  __esModule: true,
  default: ({ title, actions, children }: { title: string; actions?: React.ReactNode; children: React.ReactNode }) => (
    <section role="dialog" aria-label={title}>
      <h2>{title}</h2>
      {actions}
      {children}
    </section>
  ),
}));

jest.mock("../../_components/BackToProjectsButton", () => ({
  __esModule: true,
  default: () => <button type="button">Back to projects</button>,
}));

jest.mock("../../_components/OpenRevealButton", () => ({
  __esModule: true,
  default: ({ href }: { href: string }) => <a href={href}>View full project</a>,
}));

const project: Project = {
  id: 1,
  slug: "missing-modal-media",
  title: "Missing modal media",
  summary: "A modal project whose local media is unavailable.",
  featured: true,
  year: 2026,
  role: "Developer",
  stack: ["Next.js"],
  tags: ["Accessibility"],
  problem: "Problem",
  solution: "Solution",
  result: "Result",
  features: ["Safe media"],
  images: ["/images/projects/missing-modal.jpg"],
  links: {},
  media: { cover: "/images/projects/missing-modal.jpg", coverAlt: "Missing modal media preview", gallery: [] },
  caseStudy: { problem: "Problem", solution: "Solution", result: "Result" },
  display: { showLiveLink: false, showGithubLink: false, showPreview: true, showFullProject: true },
};

test("uses a semantic fallback for missing intercepted-modal media", async () => {
  jest.mocked(getProjectBySlug).mockResolvedValue(project);

  const { container } = render(
    await ProjectModal({ params: Promise.resolve({ slug: project.slug }) }),
  );

  expect(screen.getByRole("dialog", { name: project.title })).toBeInTheDocument();
  expect(screen.getByText("Preview unavailable")).toBeInTheDocument();
  expect(container.querySelector("img")).not.toBeInTheDocument();
  expect(container.innerHTML).not.toContain("missing-modal.jpg");
  expect(screen.getByRole("link", { name: /view full project/i })).toHaveAttribute(
    "href",
    `/projects/${project.slug}`,
  );
  expect(await axe(container)).toHaveNoViolations();
});

test("keeps Council Preview content available with verified public action links", async () => {
  const council = PROJECTS.find(
    (candidate) => candidate.slug === "council-digital-platforms-mini-lab",
  )!;
  jest.mocked(getProjectBySlug).mockResolvedValue(council);

  const { container } = render(
    await ProjectModal({ params: Promise.resolve({ slug: council.slug }) }),
  );

  expect(getProjectBySlug).toHaveBeenCalledWith(council.slug);
  expect(screen.getByRole("dialog", { name: council.title })).toBeInTheDocument();
  expect(screen.getByAltText("Council Digital Platforms Mini Lab case study overview page")).toHaveAttribute(
    "src",
    "/images/projects/council-digital-platforms-mini-lab/cover.png",
  );
  expect(screen.getByRole("link", { name: /view full project/i })).toHaveAttribute(
    "href",
    `/projects/${council.slug}`,
  );
  const live = screen.getByRole("link", { name: "Live" });
  const github = screen.getByRole("link", { name: "GitHub" });
  expect(live).toHaveAttribute("href", "https://council-digital-platforms-mini-lab.netlify.app/");
  expect(live).toHaveAttribute("target", "_blank");
  expect(live).toHaveAttribute("rel", "noreferrer");
  expect(github).toHaveAttribute("href", "https://github.com/tigerkaplan/council-digital-platforms-mini-lab");
  expect(github).toHaveAttribute("target", "_blank");
  expect(github).toHaveAttribute("rel", "noreferrer");
  expect(container.querySelector("img")).toBeInTheDocument();
});

test("keeps a temporary generic record visible in its Preview modal", async () => {
  const futureProject: Project = {
    ...project,
    slug: "future-project",
    title: "Future project",
    featured: false,
    images: [],
    media: { cover: null, coverAlt: "", gallery: [] },
  };
  jest.mocked(getProjectBySlug).mockResolvedValue(futureProject);

  const { container } = render(
    await ProjectModal({ params: Promise.resolve({ slug: futureProject.slug }) }),
  );

  expect(screen.getByRole("dialog", { name: futureProject.title })).toBeInTheDocument();
  expect(screen.getByText("Preview unavailable")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /view full project/i })).toHaveAttribute(
    "href",
    `/projects/${futureProject.slug}`,
  );
  expect(screen.queryByRole("link", { name: "Live" })).not.toBeInTheDocument();
  expect(screen.queryByRole("link", { name: "GitHub" })).not.toBeInTheDocument();
  expect(container.querySelector("img")).not.toBeInTheDocument();
});

test("uses the normal not-found behaviour for the previous Personal Portfolio Preview slug", async () => {
  jest.mocked(getProjectBySlug).mockResolvedValue(undefined);

  await expect(
    ProjectModal({ params: Promise.resolve({ slug: "seo-portfolio-platform" }) }),
  ).rejects.toThrow("NEXT_NOT_FOUND");
  expect(notFound).toHaveBeenCalled();
});

test("resolves Personal Portfolio through the existing Preview modal with approved media", async () => {
  const portfolio = PROJECTS.find(
    (candidate) => candidate.slug === "personal-portfolio-2026",
  )!;
  jest.mocked(getProjectBySlug).mockResolvedValue(portfolio);

  render(
    await ProjectModal({ params: Promise.resolve({ slug: portfolio.slug }) }),
  );

  expect(getProjectBySlug).toHaveBeenCalledWith(portfolio.slug);
  expect(screen.getByRole("dialog", { name: "Personal Portfolio 2026" })).toBeInTheDocument();
  expect(screen.getByText(portfolio.summary)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /view full project/i })).toHaveAttribute(
    "href",
    `/projects/${portfolio.slug}`,
  );
  expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
    "href",
    "https://github.com/tigerkaplan/pp_2026",
  );
  expect(screen.getByAltText("Personal Portfolio 2026 homepage showing navigation, featured projects and project cards")).toHaveAttribute(
    "src",
    "/images/projects/personal-portfolio-2026/homepage.png",
  );
  expect(screen.getByRole("link", { name: "Live" })).toHaveAttribute(
    "href",
    "https://husniyeerparundev.netlify.app/",
  );
});

test("resolves Clive Lutley Painting Gallery through the generic Preview modal", async () => {
  const clive = PROJECTS.find(
    (candidate) => candidate.slug === "clive-lutley-painting-gallery",
  )!;
  jest.mocked(getProjectBySlug).mockResolvedValue(clive);

  render(
    await ProjectModal({ params: Promise.resolve({ slug: clive.slug }) }),
  );

  expect(getProjectBySlug).toHaveBeenCalledWith(clive.slug);
  expect(screen.getByRole("dialog", { name: clive.title })).toBeInTheDocument();
  expect(screen.getByText(clive.summary)).toBeInTheDocument();
  expect(screen.getByAltText("English homepage showing the Clive Lutley logo, artist portrait, navigation and gallery call to action.")).toHaveAttribute(
    "src",
    "/images/projects/clive-lutley-painting-gallery/cover.png",
  );
  expect(screen.getByRole("link", { name: /view full project/i })).toHaveAttribute(
    "href",
    `/projects/${clive.slug}`,
  );
  expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
    "href",
    "https://github.com/tigerkaplan/cl-painting-gallery",
  );
  expect(screen.getByRole("link", { name: "Live" })).toHaveAttribute(
    "href",
    "https://cl-painting-gallery.netlify.app",
  );
});

test("resolves Bakery through the existing Preview modal with its approved cover and public links", async () => {
  const bakery = PROJECTS.find(
    (candidate) => candidate.slug === "bakery-project",
  )!;
  jest.mocked(getProjectBySlug).mockResolvedValue(bakery);

  render(
    await ProjectModal({ params: Promise.resolve({ slug: bakery.slug }) }),
  );

  expect(screen.getByRole("dialog", { name: bakery.title })).toBeInTheDocument();
  expect(screen.getByText("Client Work")).toBeInTheDocument();
  expect(screen.queryByText("Featured")).not.toBeInTheDocument();
  expect(screen.getByAltText("Patisserie 4 You homepage with coffee-bean hero image, navigation and bakery name.")).toHaveAttribute(
    "src",
    "/images/projects/bakery-project/cover.png",
  );
  expect(screen.getByRole("link", { name: /view full project/i })).toHaveAttribute(
    "href",
    "/projects/bakery-project",
  );
  expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
    "href",
    "https://github.com/tigerkaplan/bakeryProject",
  );
  expect(screen.getByRole("link", { name: "Live" })).toHaveAttribute(
    "href",
    "https://bakeryprojectapp.netlify.app/",
  );
});
