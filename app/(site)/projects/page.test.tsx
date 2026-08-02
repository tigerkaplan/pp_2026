import { render, screen } from "@testing-library/react";
import ProjectsPage from "./page";
import type { Project } from "./_types/project";

jest.mock("./_components/ProjectGrid", () => ({
  __esModule: true,
  default: ({
    projects,
    variant,
  }: {
    projects: Project[];
    variant: "all" | "featured";
  }) => (
    <div
      data-testid={`${variant}-projects-grid`}
      data-count={projects.length}
      data-first-project={projects[0]?.slug}
    >
      {projects.map((project) => <span key={project.slug}>{project.title}</span>)}
    </div>
  ),
}));

jest.mock("@/components/navigation/OnThisPage", () => ({
  __esModule: true,
  default: ({ projects }: { projects: Project[] }) => (
    <aside data-testid="on-this-page" data-count={projects.length} />
  ),
}));

test("renders the real projects page with explicit grid contracts and offsets", async () => {
  const { container } = render(await ProjectsPage());

  expect(screen.getByTestId("featured-projects-grid")).toHaveAttribute(
    "data-count",
    "2",
  );
  expect(screen.getByTestId("on-this-page")).toHaveAttribute(
    "data-count",
    "2",
  );
  expect(screen.getByTestId("featured-projects-grid")).toHaveAttribute(
    "data-first-project",
    "council-digital-platforms-mini-lab",
  );
  expect(screen.queryByTestId("all-projects-grid")).not.toBeInTheDocument();
  expect(screen.getByText("Council Digital Platforms Mini Lab")).toBeInTheDocument();
  expect(screen.getByText("Personal Portfolio 2026")).toBeInTheDocument();
  expect(screen.queryByText("Next.js eCommerce Platform")).not.toBeInTheDocument();

  const projectsRoot = container.querySelector("[data-projects-page]");
  expect(projectsRoot).toHaveClass("relative");
  expect(projectsRoot).not.toHaveClass("pt-1");
  expect(
    screen.getByRole("heading", { name: "Featured Projects" }),
  ).toHaveClass("scroll-mt-28");
  expect(screen.queryByRole("heading", { name: "All Projects" })).not.toBeInTheDocument();

  const contentSection = container.querySelector(
    "[data-projects-page] > section",
  );
  expect(contentSection).toHaveClass("min-[1800px]:pr-80");
  expect(contentSection?.className).not.toContain(["2xl", "pr-80"].join(":"));
});
