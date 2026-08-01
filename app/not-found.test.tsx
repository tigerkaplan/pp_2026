import { render, screen } from "@testing-library/react";
import NotFound from "./not-found";

test("provides clear recovery actions for unavailable routes", () => {
  render(<NotFound />);

  expect(screen.getByRole("heading", { name: "Page not found", level: 1 })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Return home" })).toHaveAttribute("href", "/");
  expect(screen.getByRole("link", { name: "View published projects" })).toHaveAttribute("href", "/projects");
});
