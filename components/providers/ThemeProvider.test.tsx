import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { ThemeProvider } from "./ThemeProvider";
import ThemeToggle from "./ThemeToggle";

test("uses system preference and exposes an accurate toggle state", async () => {
  (window.matchMedia as jest.Mock).mockImplementation(() => ({
    matches: true, addEventListener: jest.fn(), removeEventListener: jest.fn(),
  }));
  const user = userEvent.setup();
  const { container } = render(<ThemeProvider><ThemeToggle /></ThemeProvider>);
  const toggle = await screen.findByRole("button", { name: "Switch to light theme" });
  expect(toggle).toHaveAttribute("aria-pressed", "true");
  await user.click(toggle);
  expect(screen.getByRole("button", { name: "Switch to dark theme" })).toHaveAttribute("aria-pressed", "false");
  expect(await axe(container)).toHaveNoViolations();
});

test("restores a saved choice and tolerates storage failures", async () => {
  jest.spyOn(Storage.prototype, "getItem").mockReturnValue("light");
  const setItem = jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
  expect(() => render(<ThemeProvider><ThemeToggle /></ThemeProvider>)).not.toThrow();
  expect(await screen.findByRole("button", { name: "Switch to dark theme" })).toBeInTheDocument();
  setItem.mockRestore();
});
