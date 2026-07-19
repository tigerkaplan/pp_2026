import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import ProjectCard from "./ProjectCard";
import type { Project } from "../_types/project";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ fill: _fill, priority: _priority, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean }) => <img {...props} />,
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

test("keeps project details available through a crawlable route", async () => {
  const { container } = render(<ProjectCard project={project} />);
  const links = screen.getAllByRole("link", { name: /accessible project|details/i });
  expect(links.some((link) => link.getAttribute("href") === "/projects/accessible-project")).toBe(true);
  expect(await axe(container)).toHaveNoViolations();
});
