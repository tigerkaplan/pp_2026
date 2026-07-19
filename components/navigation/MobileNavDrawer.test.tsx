import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import MobileNavDrawer from "./MobileNavDrawer";

jest.mock("next/navigation", () => ({ usePathname: () => "/" }));

test("traps focus, closes with Escape, restores focus and scroll", async () => {
  const user = userEvent.setup();
  const { container } = render(<div><button>Background action</button><MobileNavDrawer /></div>);
  const trigger = screen.getByRole("button", { name: "Open menu" });
  await user.click(trigger);

  expect(trigger).toHaveAttribute("aria-expanded", "true");
  const dialog = screen.getByRole("dialog", { name: "Menu" });
  expect(dialog).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();
  expect(screen.getByRole("button", { name: "Background action" })).toHaveProperty("inert", true);
  expect(document.body.style.overflow).toBe("hidden");

  await user.tab({ shift: true });
  expect(dialog).toContainElement(document.activeElement as HTMLElement);
  await user.keyboard("{Escape}");
  expect(screen.queryByRole("dialog", { name: "Menu" })).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
  expect(document.body.style.overflow).toBe("");
  expect(await axe(container)).toHaveNoViolations();
});

test("route selection closes the drawer", async () => {
  const user = userEvent.setup();
  render(<MobileNavDrawer />);
  await user.click(screen.getByRole("button", { name: "Open menu" }));
  await user.click(screen.getByRole("link", { name: "About" }));
  expect(screen.queryByRole("dialog", { name: "Menu" })).not.toBeInTheDocument();
});
