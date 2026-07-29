import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import ProjectPage, {
  dynamicParams,
  generateMetadata,
  generateStaticParams,
} from "./page";
import { getProjectBySlug } from "../_lib/getProjectBySlug";
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
  images: [
    "/images/projects/missing-hero.jpg",
    "/images/projects/missing-gallery.jpg",
  ],
  links: {},
};

test("prebuilds only the twelve known project routes", async () => {
  const params = await generateStaticParams();

  expect(dynamicParams).toBe(false);
  expect(params).toHaveLength(12);
  expect(params).toContainEqual({ slug: "seo-portfolio-platform" });
  expect(params).not.toContainEqual({ slug: "not-a-real-project" });
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

test("uses semantic fallbacks for missing full-page project media", async () => {
  jest.mocked(getProjectBySlug).mockResolvedValue(project);

  const { container } = render(
    await ProjectPage({ params: Promise.resolve({ slug: project.slug }) }),
  );

  expect(screen.getByRole("heading", { name: project.title, level: 1 })).toBeInTheDocument();
  expect(screen.getAllByText("Preview unavailable")).toHaveLength(2);
  expect(screen.getAllByText(project.title).length).toBeGreaterThan(1);
  expect(container.querySelector("img")).not.toBeInTheDocument();
  expect(container.innerHTML).not.toContain("missing-hero.jpg");
  expect(container.innerHTML).not.toContain("missing-gallery.jpg");
  expect(screen.getByRole("link", { name: /back to projects/i })).toHaveAttribute("href", "/projects");
  expect(await axe(container)).toHaveNoViolations();
});
