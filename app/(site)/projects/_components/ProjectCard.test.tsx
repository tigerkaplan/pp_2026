import { render, screen, within } from "@testing-library/react";
import { axe } from "jest-axe";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import ProjectCard from "./ProjectCard";
import type { Project } from "../_types/project";
import { PROJECTS } from "../_lib/projects.data";

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

jest.mock("node:fs", () => ({
  ...jest.requireActual<typeof import("node:fs")>("node:fs"),
  existsSync: jest.fn(),
}));

afterEach(() => {
  jest.mocked(existsSync).mockReset();
});

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
  media: { cover: null, coverAlt: "", gallery: [] },
  caseStudy: { problem: "Problem", solution: "Solution", result: "Result" },
  display: { showLiveLink: false, showGithubLink: false, showPreview: true, showFullProject: true },
};

const missingImageProject: Project = {
  ...project,
  images: ["/images/projects/missing-image.jpg"],
};

const validImageProject: Project = {
  ...project,
  images: ["/images/projects/test-valid-media.png"],
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

test("renders valid safe project media when the local asset is available", () => {
  jest.mocked(existsSync).mockReturnValue(true);

  const { container } = render(<ProjectCard project={validImageProject} />);

  expect(container.querySelector("img")).toHaveAttribute(
    "src",
    "/images/projects/test-valid-media.png",
  );
  expect(screen.queryByText(/preview unavailable/i)).not.toBeInTheDocument();
  expect(jest.mocked(existsSync)).toHaveBeenCalled();
});

test("keeps real project media unobscured and details in the card body", () => {
  jest.mocked(existsSync).mockReturnValue(true);

  const { container } = render(<ProjectCard project={validImageProject} />);
  const header = container.querySelector<HTMLElement>("[data-project-header]")!;
  const content = container.querySelector<HTMLElement>("[data-project-content]")!;

  expect(header).toHaveTextContent("Accessibility");
  expect(header).not.toHaveTextContent(validImageProject.title);
  expect(header).not.toHaveTextContent(String(validImageProject.year));
  expect(header).not.toHaveTextContent(validImageProject.role);
  expect(header).not.toHaveTextContent(validImageProject.summary);
  expect(header.querySelector('[class*="linear-gradient"]')).toBeNull();
  expect(content).toHaveTextContent(validImageProject.title);
  expect(content).toHaveTextContent(String(validImageProject.year));
  expect(content).toHaveTextContent(validImageProject.role);
  expect(content).toHaveTextContent(validImageProject.summary);
});

test("keeps the missing-media fallback inside media and its content below", () => {
  const { container } = render(<ProjectCard project={missingImageProject} />);
  const media = container.querySelector<HTMLElement>("[data-project-media]")!;
  const content = container.querySelector<HTMLElement>(
    "[data-project-title-content]",
  )!;

  expect(within(media).getByText(/preview unavailable/i)).toBeInTheDocument();
  expect(screen.queryByRole("img")).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: /view full project/i })).toHaveAttribute("href", "/projects/accessible-project");
  expect(media).toHaveClass("relative", "overflow-hidden", "h-48");
  expect(content).toHaveTextContent("Accessible project");
  expect(content).toHaveTextContent("Digital Developer");
  expect(media).not.toContainElement(content);
  expect(media.compareDocumentPosition(content) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
    Node.DOCUMENT_POSITION_FOLLOWING,
  );
});

test("uses the same contained fallback and below-media content structure for featured cards", () => {
  const { container } = render(
    <ProjectCard project={missingImageProject} variant="featured" />,
  );
  const media = container.querySelector<HTMLElement>("[data-project-media]")!;
  const content = container.querySelector<HTMLElement>(
    "[data-project-title-content]",
  )!;

  expect(within(media).getByText(/preview unavailable/i)).toBeInTheDocument();
  expect(media).toHaveClass("h-56");
  expect(content).toHaveTextContent("Accessible project");
  expect(media.compareDocumentPosition(content) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
    Node.DOCUMENT_POSITION_FOLLOWING,
  );
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

test("renders Council Preview, full-project and verified external actions", () => {
  const council = PROJECTS.find(
    (candidate) => candidate.slug === "council-digital-platforms-mini-lab",
  )!;
  jest.mocked(existsSync).mockReturnValue(true);
  render(<ProjectCard project={council} variant="featured" />);
  const previews = screen.getAllByRole("link", { name: /preview council/i });

  expect(screen.getByAltText("Council Digital Platforms Mini Lab case study overview page")).toHaveAttribute(
    "src",
    "/images/projects/council-digital-platforms-mini-lab/cover.png",
  );
  previews.forEach((preview) => {
    expect(preview).toHaveAttribute("href", `/projects/${council.slug}`);
    expect(preview).toHaveAttribute("data-next-link", "true");
  });
  expect(screen.getByRole("link", { name: /view full project/i })).toBeInTheDocument();
  screen.getAllByRole("link", { name: "Live" }).forEach((live) => {
    expect(live).toHaveAttribute("href", "https://council-digital-platforms-mini-lab.netlify.app/");
    expect(live).toHaveAttribute("target", "_blank");
    expect(live).toHaveAttribute("rel", "noreferrer");
  });
  screen.getAllByRole("link", { name: "GitHub" }).forEach((github) => {
    expect(github).toHaveAttribute("href", "https://github.com/tigerkaplan/council-digital-platforms-mini-lab");
    expect(github).toHaveAttribute("target", "_blank");
    expect(github).toHaveAttribute("rel", "noreferrer");
  });
});

test("sources card media from generic project data rather than a project slug", () => {
  const source = readFileSync(
    path.join(process.cwd(), "app", "(site)", "projects", "_components", "ProjectCard.tsx"),
    "utf8",
  );

  expect(source).toContain("project.images?.[0]");
  expect(source).toContain("project.media.coverAlt");
  expect(source).not.toContain("personal-portfolio-2026");
});

test("keeps a visible temporary generic card when its media and external actions are unavailable", () => {
  render(<ProjectCard project={project} />);

  expect(screen.getAllByText(project.title)).toHaveLength(2);
  expect(screen.getByText("Preview unavailable")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: `Preview ${project.title}` })).toHaveAttribute(
    "href",
    `/projects/${project.slug}`,
  );
  expect(screen.getByRole("link", { name: /view full project/i })).toHaveAttribute(
    "href",
    `/projects/${project.slug}`,
  );
  expect(screen.queryByRole("link", { name: "Live" })).not.toBeInTheDocument();
  expect(screen.queryByRole("link", { name: "GitHub" })).not.toBeInTheDocument();
});

test("renders the Personal Portfolio card with approved media and verified actions", () => {
  const portfolio = PROJECTS.find(
    (candidate) => candidate.slug === "personal-portfolio-2026",
  )!;
  jest.mocked(existsSync).mockReturnValue(true);
  render(<ProjectCard project={portfolio} variant="featured" />);

  const previews = screen.getAllByRole("link", {
    name: "Preview Personal Portfolio 2026",
  });
  expect(screen.getAllByText("Personal Portfolio 2026")).toHaveLength(1);
  expect(screen.getByText(portfolio.summary)).toBeInTheDocument();
  expect(screen.getByAltText("Personal Portfolio 2026 homepage showing navigation, featured projects and project cards")).toHaveAttribute(
    "src",
    "/images/projects/personal-portfolio-2026/homepage.png",
  );
  previews.forEach((preview) => {
    expect(preview).toHaveAttribute("href", `/projects/${portfolio.slug}`);
    expect(preview).toHaveAttribute("data-next-link", "true");
  });
  screen.getAllByRole("link", { name: "Live" }).forEach((live) => {
    expect(live).toHaveAttribute("href", "https://husniyeerparundev.netlify.app/");
    expect(live).toHaveAttribute("target", "_blank");
    expect(live).toHaveAttribute("rel", "noreferrer");
  });
  screen.getAllByRole("link", { name: "GitHub" }).forEach((github) => {
    expect(github).toHaveAttribute("href", "https://github.com/tigerkaplan/pp_2026");
    expect(github).toHaveAttribute("target", "_blank");
    expect(github).toHaveAttribute("rel", "noreferrer");
  });
  expect(screen.getByRole("link", { name: /view full project/i })).toHaveAttribute(
    "href",
    `/projects/${portfolio.slug}`,
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
  expect(technologies).toHaveClass("flex-nowrap", "min-w-0");
  expect(technologies).not.toHaveClass("overflow-hidden");
  expect(
    within(wideActions as HTMLElement)
      .getAllByRole("link")
      .map((link) => link.textContent),
  ).toEqual(["Live", "GitHub", "Preview", "View full project"]);
  expect(
    within(wideActions as HTMLElement).queryByRole("button"),
  ).not.toBeInTheDocument();
  expect(wideActions).toHaveClass("hidden", "@[21rem]:flex");
  expect(compactActions).toHaveClass("flex", "flex-nowrap", "@[21rem]:hidden");
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
  expect(technologies).toHaveAttribute("data-project-technologies");
});

test("keeps All-project content in compact normal flow before its footer", () => {
  const { container } = render(<ProjectCard project={denseProject} />);
  const card = container.querySelector<HTMLElement>("article")!;
  const body = container.querySelector<HTMLElement>("[data-project-card-body]")!;
  const content = container.querySelector<HTMLElement>("[data-project-content]")!;
  const footer = container.querySelector<HTMLElement>("[data-project-footer]")!;

  expect(card).toHaveClass("flex", "h-full", "flex-col");
  expect(body).toHaveClass("flex", "flex-1", "flex-col");
  expect(content).toHaveClass("flex", "flex-col", "gap-3", "px-5", "pb-5", "pt-3");
  expect(content).not.toHaveClass("flex-1", "justify-between", "min-h-16");
  expect(content).toHaveTextContent("A representative project card.");
  expect(content).toHaveTextContent("Highlights");
  expect(content).toHaveTextContent("Keyboard support");
  expect(content.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
    Node.DOCUMENT_POSITION_FOLLOWING,
  );
});

test("uses the same controlled flexible body before the Featured footer", () => {
  const { container } = render(
    <ProjectCard project={denseProject} variant="featured" />,
  );
  const body = container.querySelector<HTMLElement>("[data-project-card-body]")!;
  const footer = container.querySelector<HTMLElement>("[data-project-footer]")!;

  expect(body).toHaveClass("flex", "flex-1", "flex-col");
  expect(body).not.toHaveClass("justify-between");
  expect(body.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
    Node.DOCUMENT_POSITION_FOLLOWING,
  );
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
