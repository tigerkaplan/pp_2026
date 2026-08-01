import { render, screen, within } from "@testing-library/react";
import HomePage from "./page";
import AboutPage from "./about/page";
import ContactPage from "./contact/page";
import SkillsPage from "./skills/page";

test("presents the verified Home actions, featured records and skills preview", async () => {
  render(await HomePage());

  expect(screen.getByRole("heading", { name: /front-end development/i, level: 1 })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "View projects" })).toHaveAttribute("href", "/projects");
  expect(screen.getByRole("link", { name: "About the approach" })).toHaveAttribute("href", "/about");
  expect(screen.getByRole("link", { name: "Explore skills" })).toHaveAttribute("href", "/skills");
  expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/contact");
  expect(screen.getByRole("heading", { name: "Featured work", level: 2 })).toBeInTheDocument();
  expect(screen.getByText("Council Digital Platforms Mini Lab")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "View full project: Personal Portfolio 2026" })).toHaveAttribute(
    "href",
    "/projects/seo-portfolio-platform",
  );
});

test("keeps About evidence-led and links to the Skills route", () => {
  render(<AboutPage />);

  expect(screen.getByRole("heading", { name: "About", level: 1 })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Evidence-led presentation", level: 2 })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "View skills and evidence levels" })).toHaveAttribute("href", "/skills");
});

test("renders skills in validated evidence groups", () => {
  render(<SkillsPage />);

  expect(screen.getByRole("heading", { name: "Skills", level: 1 })).toBeInTheDocument();
  const accessibleGroup = screen.getByRole("heading", {
    name: "Accessible Digital Services",
    level: 2,
  }).parentElement!;
  expect(within(accessibleGroup).getByText("Accessible form design")).toBeInTheDocument();
  expect(within(accessibleGroup).getByText("Developing knowledge")).toBeInTheDocument();
});

test("publishes only the verified GitHub contact action", () => {
  render(<ContactPage />);

  expect(screen.getByRole("heading", { name: "Contact", level: 1 })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Open the portfolio repository on GitHub" })).toHaveAttribute(
    "href",
    "https://github.com/tigerkaplan/pp_2026",
  );
  expect(screen.queryByRole("link", { name: /email|linkedin|cv/i })).not.toBeInTheDocument();
});
