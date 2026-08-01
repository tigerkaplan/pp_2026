import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { MainNav } from "./MainNav";

jest.mock("next/navigation", () => ({ usePathname: () => "/projects" }));

test("renders labelled route navigation and identifies the current page", async () => {
  const { container } = render(<MainNav />);
  expect(
    screen.getByRole("navigation", { name: "Primary navigation" }),
  ).toHaveAttribute("data-navigation-mode", "default");
  expect(screen.getByRole("link", { name: /projects current/i })).toHaveAttribute("aria-current", "page");
  expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
  expect(await axe(container)).toHaveNoViolations();
});

test("uses one symmetric, internally scrollable spacing rule for desktop", () => {
  const { container } = render(<MainNav desktop />);
  const navigation = screen.getByRole("navigation", {
    name: "Primary navigation",
  });
  const scrollRegion = container.querySelector(
    "[data-desktop-navigation-scroll]",
  );

  expect(navigation).toHaveAttribute("data-navigation-mode", "desktop");
  expect(navigation).toHaveClass("h-full", "min-h-0");
  expect(scrollRegion).toHaveClass(
    "min-h-0",
    "overflow-y-auto",
    "py-6",
    "px-1",
  );
  expect(scrollRegion).not.toHaveClass("mt-4");
  expect(screen.getAllByRole("link")).toHaveLength(5);
  expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Skills" })).toHaveAttribute("href", "/skills");
  expect(screen.getByRole("link", { name: "Contact" })).toBeInTheDocument();
});
