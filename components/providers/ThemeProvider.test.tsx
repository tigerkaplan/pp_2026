import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { renderToString } from "react-dom/server";
import { ThemeProvider } from "./ThemeProvider";
import ThemeToggle from "./ThemeToggle";

function setSystemDark(matches: boolean) {
  (window.matchMedia as jest.Mock).mockImplementation(() => ({
    matches,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }));
}

beforeEach(() => {
  window.localStorage.clear();
  document.documentElement.classList.remove("dark");
  document.documentElement.style.colorScheme = "";
  setSystemDark(false);
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("uses a missing preference with system dark and toggles immediately", async () => {
  setSystemDark(true);
  const user = userEvent.setup();
  const { container } = render(<ThemeProvider><ThemeToggle /></ThemeProvider>);
  const toggle = await screen.findByRole("button", { name: "Switch to light mode" });
  expect(toggle).toHaveAttribute("aria-pressed", "true");
  expect(toggle).toHaveAttribute("title", "Switch to light mode");
  expect(toggle).toHaveClass("h-11", "w-11");
  expect(toggle).not.toHaveTextContent(/light|dark/i);
  const sun = toggle.querySelector('[data-theme-icon="sun"]');
  expect(sun).toHaveAttribute("aria-hidden", "true");
  expect(sun).toHaveAttribute("focusable", "false");
  expect(sun).toHaveClass("h-5", "w-5");
  expect(document.documentElement).toHaveClass("dark");
  expect(document.documentElement).toHaveStyle({ colorScheme: "dark" });
  await user.click(toggle);
  const lightToggle = screen.getByRole("button", { name: "Switch to dark mode" });
  expect(lightToggle).toHaveAttribute("aria-pressed", "false");
  expect(lightToggle).toHaveAttribute("title", "Switch to dark mode");
  expect(lightToggle.querySelector('[data-theme-icon="moon"]')).toBeInTheDocument();
  expect(document.documentElement).not.toHaveClass("dark");
  expect(document.documentElement).toHaveStyle({ colorScheme: "light" });
  expect(window.localStorage.getItem("theme")).toBe("light");
  expect(await axe(container)).toHaveNoViolations();
});

test("emits icon-only hydration-stable markup selected by the pre-paint root class", () => {
  const host = document.createElement("div");
  host.innerHTML = renderToString(
    <ThemeProvider defaultSetting="dark"><ThemeToggle /></ThemeProvider>
  );

  const toggle = host.querySelector("button");
  const moon = toggle?.querySelector('[data-theme-icon="moon"]');
  const sun = toggle?.querySelector('[data-theme-icon="sun"]');

  expect(toggle).toHaveAccessibleName("Change colour theme");
  expect(toggle).not.toHaveAttribute("aria-pressed");
  expect(toggle).toHaveTextContent("");
  expect(moon?.parentElement).toHaveClass("dark:hidden");
  expect(sun?.parentElement).toHaveClass("hidden", "dark:block");
});

test("keeps a stored dark preference authoritative over system light", async () => {
  window.localStorage.setItem("theme", "dark");

  render(<ThemeProvider><ThemeToggle /></ThemeProvider>);

  const toggle = await screen.findByRole("button", { name: "Switch to light mode" });
  expect(toggle).toHaveAttribute("aria-pressed", "true");
  expect(toggle.querySelector('[data-theme-icon="sun"]')).toBeInTheDocument();
  expect(document.documentElement).toHaveClass("dark");
  expect(document.documentElement).toHaveStyle({ colorScheme: "dark" });
});

test("keeps a stored light preference authoritative over system dark", async () => {
  setSystemDark(true);
  window.localStorage.setItem("theme", "light");

  render(<ThemeProvider><ThemeToggle /></ThemeProvider>);

  const toggle = await screen.findByRole("button", { name: "Switch to dark mode" });
  expect(toggle).toHaveAttribute("aria-pressed", "false");
  expect(toggle.querySelector('[data-theme-icon="moon"]')).toBeInTheDocument();
  expect(document.documentElement).not.toHaveClass("dark");
  expect(document.documentElement).toHaveStyle({ colorScheme: "light" });
});

test("uses a missing preference with system light", async () => {
  render(<ThemeProvider><ThemeToggle /></ThemeProvider>);

  expect(await screen.findByRole("button", { name: "Switch to dark mode" })).toBeInTheDocument();
  expect(document.documentElement).not.toHaveClass("dark");
  expect(document.documentElement).toHaveStyle({ colorScheme: "light" });
});

test("uses the safe system fallback when storage is malformed or unavailable", async () => {
  setSystemDark(true);
  jest.spyOn(Storage.prototype, "getItem").mockReturnValue("sepia");
  jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("blocked");
  });

  expect(() => render(<ThemeProvider><ThemeToggle /></ThemeProvider>)).not.toThrow();
  expect(await screen.findByRole("button", { name: "Switch to light mode" })).toBeInTheDocument();
  expect(document.documentElement).toHaveClass("dark");
  expect(document.documentElement).toHaveStyle({ colorScheme: "dark" });
});

test("toggles from light with Enter and stores dark", async () => {
  const user = userEvent.setup();
  render(<ThemeProvider defaultSetting="light"><ThemeToggle /></ThemeProvider>);
  const toggle = await screen.findByRole("button", { name: "Switch to dark mode" });

  toggle.focus();
  await user.keyboard("{Enter}");

  expect(screen.getByRole("button", { name: "Switch to light mode" })).toHaveFocus();
  expect(document.documentElement).toHaveClass("dark");
  expect(window.localStorage.getItem("theme")).toBe("dark");
});

test("toggles from light with Space without exposing text", async () => {
  const user = userEvent.setup();
  render(<ThemeProvider defaultSetting="light"><ThemeToggle /></ThemeProvider>);
  const toggle = await screen.findByRole("button", { name: "Switch to dark mode" });

  toggle.focus();
  await user.keyboard(" ");

  const darkToggle = screen.getByRole("button", { name: "Switch to light mode" });
  expect(darkToggle).toHaveFocus();
  expect(darkToggle).not.toHaveTextContent(/light|dark|theme/i);
  expect(darkToggle.querySelector('[data-theme-icon="sun"]')).toBeInTheDocument();
  expect(window.localStorage.getItem("theme")).toBe("dark");
});
