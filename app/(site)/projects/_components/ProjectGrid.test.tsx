import { render } from "@testing-library/react";
import ProjectGrid from "./ProjectGrid";
import type { Project } from "../_types/project";

jest.mock("./ProjectCard", () => ({
  __esModule: true,
  default: ({ project }: { project: Project }) => (
    <article>{project.title}</article>
  ),
}));

const project: Project = {
  id: 1,
  slug: "grid-project",
  title: "Grid project",
  summary: "Grid summary",
  featured: false,
  year: 2026,
  role: "Developer",
  stack: ["Next.js"],
  tags: ["Portfolio"],
  problem: "Problem",
  solution: "Solution",
  result: "Result",
  features: ["Feature"],
  images: [],
  links: {},
  media: { cover: null, coverAlt: "", gallery: [] },
  caseStudy: { problem: "Problem", solution: "Solution", result: "Result" },
  display: { showLiveLink: false, showGithubLink: false, showPreview: true, showFullProject: true },
};

test("uses one, two and three stretched card columns at the approved breakpoints", () => {
  const { container } = render(
    <ProjectGrid projects={[project]} variant="all" />,
  );
  const grid = container.firstElementChild;

  expect(grid).toHaveClass(
    "grid-cols-1",
    "md:grid-cols-2",
    "xl:grid-cols-3",
  );
  expect(grid).toHaveAttribute("data-project-grid", "all");
});

test("keeps the featured grid visually distinct", () => {
  const { container } = render(
    <ProjectGrid projects={[project]} variant="featured" />,
  );
  const grid = container.firstElementChild;

  expect(grid).toHaveClass("grid-cols-1", "lg:grid-cols-2");
  expect(grid).not.toHaveClass("xl:grid-cols-3");
  expect(grid).toHaveAttribute("data-project-grid", "featured");
});
