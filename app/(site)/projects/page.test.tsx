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
    <div data-testid={`${variant}-projects-grid`} data-count={projects.length}>
      {variant}
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
  expect(screen.getByTestId("all-projects-grid")).toHaveAttribute(
    "data-count",
    "10",
  );
  expect(screen.getByTestId("on-this-page")).toHaveAttribute(
    "data-count",
    "12",
  );

  const projectsRoot = container.querySelector("[data-projects-page]");
  expect(projectsRoot).toHaveClass("relative");
  expect(projectsRoot).not.toHaveClass("pt-1");
  expect(
    screen.getByRole("heading", { name: "Featured Projects" }),
  ).toHaveClass("scroll-mt-28");
  expect(screen.getByRole("heading", { name: "All Projects" })).toHaveClass(
    "scroll-mt-28",
  );

  const contentSection = container.querySelector(
    "[data-projects-page] > section",
  );
  expect(contentSection).toHaveClass("min-[1800px]:pr-80");
  expect(contentSection?.className).not.toContain(["2xl", "pr-80"].join(":"));
});
