import { render, screen } from "@testing-library/react";
import OpenRevealButton from "./OpenRevealButton";

test("uses a native link for deliberate full-project navigation", () => {
  render(<OpenRevealButton href="/projects/example-project" />);

  expect(
    screen.getByRole("link", { name: "View full project" }),
  ).toHaveAttribute("href", "/projects/example-project");
  expect(document.querySelector("button")).not.toBeInTheDocument();
});
