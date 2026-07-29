import { render, screen, within } from "@testing-library/react";
import { axe } from "jest-axe";
import ProjectCard from "./ProjectCard";
import type { Project } from "../_types/project";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ fill, priority, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean }) => {
    void fill;
    void priority;
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a data-next-link="true" {...props}>
      {children}
    </a>
  ),
}));

const project: Project = {
  id: 1,
  slug: "accessible-project",
  title: "Accessible project",
  summary: "A representative project card.",
  featured: false,
  year: 2026,
  role: "Digital Developer",
  stack: ["Next.js"],
  tags: ["Accessibility"],
  problem: "Problem",
  solution: "Solution",
  result: "Result",
  features: ["Keyboard support"],
  images: ["/project.jpg"],
  links: {},
};

const validImageProject: Project = {
  ...project,
  images: ["/globe.svg"],
};

const missingImageProject: Project = {
  ...project,
  images: ["/images/projects/missing-image.jpg"],
};

const denseProject: Project = {
  ...project,
  tags: ["Accessibility", "Portfolio", "Next.js"],
  stack: ["Next.js", "React", ".NET Web API", "MS SQL Server", "Tailwind"],
  links: {
    live: "https://example.com/project",
    github: "https://github.com/example/project",
  },
};

test("renders a valid image asset when it exists", () => {
  const { container } = render(<ProjectCard project={validImageProject} />);

  expect(container.querySelector("img")).toHaveAttribute("src", "/globe.svg");
});

test("renders an accessible placeholder when no local image asset exists", () => {
  render(<ProjectCard project={missingImageProject} />);

  expect(screen.getByText(/preview unavailable/i)).toBeInTheDocument();
  expect(screen.queryByRole("img")).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: /view full project/i })).toHaveAttribute("href", "/projects/accessible-project");
});

test("renders visible preview and full-project actions for the project card", () => {
  const { container } = render(<ProjectCard project={project} />);
  const directActions = container.querySelector(
    "[data-project-actions-direct]",
  );

  expect(screen.getByRole("link", { name: /preview accessible project/i })).toHaveAttribute("href", "/projects/accessible-project");
  expect(screen.getByRole("link", { name: /view full project/i })).toHaveAttribute("href", "/projects/accessible-project");
  expect(directActions).toBeInTheDocument();
  expect(
    within(directActions as HTMLElement).queryByRole("button"),
  ).not.toBeInTheDocument();
  expect(container.querySelector("article")).toHaveClass(
    "bg-[rgb(var(--color-card-surface))]",
    "hover:bg-[rgb(var(--color-card-surface-hover))]",
    "focus-within:ring-[rgb(var(--color-focus))]",
  );
});

test("renders the full-project action as a native anchor for hard navigation", () => {
  render(<ProjectCard project={project} />);

  const fullProjectLink = screen.getByRole("link", { name: /view full project/i });
  expect(fullProjectLink).toHaveAttribute("href", "/projects/accessible-project");
  expect(fullProjectLink).not.toHaveAttribute("data-next-link");
});

test("limits intercepted navigation to the preview action", () => {
  render(<ProjectCard project={project} />);

  const interceptedLinks = document.querySelectorAll('a[data-next-link="true"]');
  expect(interceptedLinks).toHaveLength(1);
  expect(interceptedLinks[0]).toHaveAccessibleName("Preview Accessible project");
});

test("keeps actions and technologies in two aligned footer rows", () => {
  const { container } = render(
    <ProjectCard project={denseProject} variant="featured" />,
  );
  const footer = container.querySelector("[data-project-footer]");
  const actions = container.querySelector("[data-project-actions]");
  const wideActions = container.querySelector("[data-project-actions-wide]");
  const compactActions = container.querySelector(
    "[data-project-actions-compact]",
  );
  const technologies = container.querySelector(
    "[data-project-technologies]",
  );

  expect(footer).toHaveClass("min-h-[7.25rem]", "gap-2");
  expect(footer).not.toHaveClass("justify-between");
  expect(actions).toHaveClass("@container");
  expect(technologies).toHaveClass("md:flex-nowrap");
  expect(
    within(wideActions as HTMLElement)
      .getAllByRole("link")
      .map((link) => link.textContent),
  ).toEqual(["Live", "GitHub", "Preview", "View full project"]);
  expect(
    within(wideActions as HTMLElement).queryByRole("button"),
  ).not.toBeInTheDocument();
  expect(wideActions).toHaveClass("hidden", "@[21rem]:flex");
  expect(compactActions).toHaveClass("flex", "@[21rem]:hidden");
  expect(
    within(compactActions as HTMLElement).getByRole("button", {
      name: "1 more project action",
    }),
  ).toBeVisible();
  expect(
    within(compactActions as HTMLElement)
      .getAllByRole("link")
      .map((link) => link.textContent),
  ).toEqual(["Live", "GitHub", "Preview"]);
  expect(within(technologies as HTMLElement).getByText("Next.js")).toBeVisible();
  expect(within(technologies as HTMLElement).getByText("React")).toBeVisible();
  expect(
    within(technologies as HTMLElement).getByRole("button", {
      name: "3 more technologies",
    }),
  ).toBeVisible();
});

test("keeps header overflow out of the card header", () => {
  const { container } = render(<ProjectCard project={denseProject} />);
  const header = container.querySelector("[data-project-header]");

  expect(header).toHaveTextContent("Accessibility");
  expect(header).not.toHaveTextContent(/\+\d+(?: more)?/);
  expect(within(header as HTMLElement).queryByRole("button")).toBeNull();
  expect(
    within(header as HTMLElement).queryByText("Portfolio"),
  ).not.toBeInTheDocument();
});

test("keeps project details available through a crawlable route", async () => {
  const { container } = render(<ProjectCard project={project} />);
  const links = screen.getAllByRole("link", { name: /accessible project|details/i });
  expect(links.some((link) => link.getAttribute("href") === "/projects/accessible-project")).toBe(true);
  expect(await axe(container)).toHaveNoViolations();
});
