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
      {projects.map((project) => (
        <div key={project.slug}>
          <span>{project.title}</span>
          {project.media.cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={project.media.cover} alt={project.media.coverAlt} />
          ) : null}
        </div>
      ))}
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
    "3",
  );
  expect(screen.getByTestId("on-this-page")).toHaveAttribute(
    "data-count",
    "4",
  );
  expect(screen.getByTestId("featured-projects-grid")).toHaveAttribute(
    "data-first-project",
    "council-digital-platforms-mini-lab",
  );
  expect(screen.getByTestId("all-projects-grid")).toHaveAttribute(
    "data-count",
    "1",
  );
  expect(screen.getByTestId("all-projects-grid")).toHaveAttribute(
    "data-first-project",
    "clive-lutley-painting-gallery",
  );
  expect(screen.getByText("Council Digital Platforms Mini Lab")).toBeInTheDocument();
  expect(screen.getByText("Personal Portfolio 2026")).toBeInTheDocument();
  expect(screen.getByText("Clive Lutley Painting Gallery")).toBeInTheDocument();
  expect(screen.getByText("Patisserie 4 You")).toBeInTheDocument();
  expect(screen.getByAltText("Council Digital Platforms Mini Lab case study overview page")).toHaveAttribute(
    "src",
    "/images/projects/council-digital-platforms-mini-lab/cover.png",
  );
  expect(screen.getByAltText("Personal Portfolio 2026 homepage showing navigation, featured projects and project cards")).toHaveAttribute(
    "src",
    "/images/projects/personal-portfolio-2026/homepage.png",
  );
  expect(screen.getByAltText("English homepage showing the Clive Lutley logo, artist portrait, navigation and gallery call to action.")).toHaveAttribute(
    "src",
    "/images/projects/clive-lutley-painting-gallery/cover.png",
  );
  expect(screen.getByAltText("Patisserie 4 You homepage with coffee-bean hero image, navigation and bakery name.")).toHaveAttribute(
    "src",
    "/images/projects/bakery-project/cover.png",
  );
  expect(screen.queryByText("Next.js eCommerce Platform")).not.toBeInTheDocument();

  const projectsRoot = container.querySelector("[data-projects-page]");
  expect(projectsRoot).toHaveClass("relative");
  expect(projectsRoot).not.toHaveClass("pt-1");
  expect(
    screen.getByRole("heading", { name: "Featured Projects" }),
  ).toHaveClass("scroll-mt-28");
  expect(screen.getByRole("heading", { name: "All Projects" })).toHaveClass("scroll-mt-28");

  const contentSection = container.querySelector(
    "[data-projects-page] > section",
  );
  expect(contentSection).toHaveClass("min-[1800px]:pr-80");
  expect(contentSection?.className).not.toContain(["2xl", "pr-80"].join(":"));
});
