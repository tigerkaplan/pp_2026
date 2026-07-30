import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import ProjectModal from "./page";
import { getProjectBySlug } from "../../_lib/getProjectBySlug";
import { PROJECTS } from "../../_lib/projects.data";
import type { Project } from "../../_types/project";

jest.mock("../../_lib/getProjectBySlug", () => ({
  getProjectBySlug: jest.fn(),
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

test("keeps Council Preview content available without public action links", async () => {
  const council = PROJECTS.find(
    (candidate) => candidate.slug === "council-digital-platforms-mini-lab",
  )!;
  jest.mocked(getProjectBySlug).mockResolvedValue(council);

  const { container } = render(
    await ProjectModal({ params: Promise.resolve({ slug: council.slug }) }),
  );

  expect(screen.getByRole("dialog", { name: council.title })).toBeInTheDocument();
  expect(screen.getByText("Preview unavailable")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /view full project/i })).toHaveAttribute(
    "href",
    `/projects/${council.slug}`,
  );
  expect(screen.queryByRole("link", { name: "Live" })).not.toBeInTheDocument();
  expect(screen.queryByRole("link", { name: "GitHub" })).not.toBeInTheDocument();
  expect(container.querySelector("img")).not.toBeInTheDocument();
});
