import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import NotFound from "./not-found";

test("provides accessible recovery links from the root not-found boundary", async () => {
  const { container } = render(<NotFound />);

  expect(
    screen.getByRole("heading", { name: "Page not found", level: 1 }),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Go home" })).toHaveAttribute(
    "href",
    "/",
  );
  expect(screen.getByRole("link", { name: "View projects" })).toHaveAttribute(
    "href",
    "/projects",
  );
  expect(await axe(container)).toHaveNoViolations();
});
