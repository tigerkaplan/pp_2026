import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { MainNav } from "./MainNav";

jest.mock("next/navigation", () => ({ usePathname: () => "/projects" }));

test("renders labelled route navigation and identifies the current page", async () => {
  const { container } = render(<MainNav />);
  expect(screen.getByRole("navigation", { name: "Primary navigation" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /projects current/i })).toHaveAttribute("aria-current", "page");
  expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
  expect(await axe(container)).toHaveNoViolations();
});
