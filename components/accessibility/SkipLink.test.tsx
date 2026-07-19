import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import SkipLink from "./SkipLink";

test("links keyboard users to the stable main-content target", async () => {
  const { container } = render(<><SkipLink /><main id="main-content">Content</main></>);
  expect(screen.getByRole("link", { name: "Skip to main content" })).toHaveAttribute("href", "#main-content");
  expect(container.querySelectorAll("main")).toHaveLength(1);
  expect(await axe(container)).toHaveNoViolations();
});
