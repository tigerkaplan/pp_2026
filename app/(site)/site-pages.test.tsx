import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

test("renders skills in validated evidence groups and filters them by evidence level", async () => {
  const user = userEvent.setup();
  render(<SkillsPage />);

  expect(screen.getByRole("heading", { name: "Skills", level: 1 })).toBeInTheDocument();
  const allSkills = screen.getByRole("button", { name: "All" });
  const demonstrated = screen.getByRole("button", { name: "Demonstrated" });
  const developingKnowledge = screen.getByRole("button", { name: "Developing knowledge" });
  expect(allSkills).toHaveAttribute("aria-pressed", "true");
  expect(demonstrated).toHaveAttribute("aria-pressed", "false");
  expect(developingKnowledge).toHaveAttribute("aria-pressed", "false");

  const accessibleGroup = screen.getByRole("heading", {
    name: "Accessible Digital Services",
    level: 2,
  }).parentElement!;
  expect(within(accessibleGroup).getByText("Accessible form design")).toBeInTheDocument();
  expect(within(accessibleGroup).getByText("Developing knowledge")).toBeInTheDocument();

  demonstrated.focus();
  await user.keyboard("{Enter}");
  expect(demonstrated).toHaveAttribute("aria-pressed", "true");
  expect(allSkills).toHaveAttribute("aria-pressed", "false");
  expect(screen.getByText("Technical documentation")).toBeInTheDocument();
  expect(screen.queryByText("Keyboard accessibility")).not.toBeInTheDocument();
  expect(screen.queryByText("Twig")).not.toBeInTheDocument();

  await user.click(developingKnowledge);
  expect(developingKnowledge).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByText("Keyboard accessibility")).toBeInTheDocument();
  expect(screen.getByText("Twig")).toBeInTheDocument();
  expect(screen.queryByRole("heading", { name: "Data & Integration", level: 2 })).not.toBeInTheDocument();
  expect(screen.queryByRole("heading", { name: "Testing & Delivery", level: 2 })).not.toBeInTheDocument();
  expect(screen.queryByRole("heading", { name: "Front-end Development", level: 2 })).not.toBeInTheDocument();

  await user.click(allSkills);
  expect(allSkills).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByText("Keyboard accessibility")).toBeInTheDocument();
  expect(screen.getByText("Technical documentation")).toBeInTheDocument();
});

test("renders the Contact form and presents GitHub as an additional source route", () => {
  render(<ContactPage />);

  expect(screen.getByRole("heading", { name: "Contact", level: 1 })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Send a message", level: 2 })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Send message" })).toBeDisabled();
  expect(screen.getByRole("status")).toHaveTextContent("Online messaging is temporarily unavailable.");
  expect(screen.getByText("You can also explore the portfolio source code and development approach on GitHub.")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "View the portfolio on GitHub" })).toHaveAttribute(
    "href",
    "https://github.com/tigerkaplan/pp_2026",
  );
  expect(screen.queryByText(/if online messaging is unavailable/i)).not.toBeInTheDocument();
  expect(screen.queryByRole("link", { name: /email|linkedin|cv/i })).not.toBeInTheDocument();
});

test("does not restore stale source wording when the Contact form is configured", () => {
  const previousFormId = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID;
  process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID = "configured-test-form";

  try {
    render(<ContactPage />);

    expect(screen.getByRole("button", { name: "Send message" })).toBeEnabled();
    expect(screen.queryByText(/if online messaging is unavailable/i)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View the portfolio on GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/tigerkaplan/pp_2026",
    );
  } finally {
    if (previousFormId === undefined) {
      delete process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID;
    } else {
      process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID = previousFormId;
    }
  }
});
