import { render, screen } from "@testing-library/react";
import OnThisPageProjects from "./OnThisPage";
import { PROJECTS } from "@/app/(site)/projects/_lib/projects.data";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props}>{children}</a>
  ),
}));

test("shows the fixed projects index only at the very-wide breakpoint", () => {
  const { container } = render(<OnThisPageProjects projects={PROJECTS} />);
  const panel = container.querySelector("aside");

  expect(panel).toHaveClass("hidden", "min-[1800px]:block");
  expect(panel?.className).not.toContain(["2xl", "block"].join(":"));
  expect(
    screen.getByRole("button", { name: /on this page/i }),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Featured Projects" })).toHaveAttribute(
    "href",
    "#featured-projects",
  );
  expect(screen.getByRole("link", { name: "All Projects" })).toHaveAttribute(
    "href",
    "#all-projects",
  );
});
