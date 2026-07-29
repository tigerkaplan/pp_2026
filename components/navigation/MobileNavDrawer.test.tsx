import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import MobileNavDrawer from "./MobileNavDrawer";

let mockPathname = "/";

jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

test("traps focus, closes with Escape, restores focus and scroll", async () => {
  const user = userEvent.setup();
  const { container } = render(<div><button>Background action</button><MobileNavDrawer /></div>);
  const trigger = screen.getByRole("button", { name: "Open menu" });
  expect(trigger).toHaveClass("min-h-11", "min-w-11");
  await user.click(trigger);

  expect(trigger).toHaveAttribute("aria-expanded", "true");
  const dialog = screen.getByRole("dialog", { name: "Menu" });
  const backdrop = document.body.querySelector("[data-mobile-drawer-backdrop]");
  const panel = document.body.querySelector("[data-mobile-drawer-panel]");
  const root = document.body.querySelector("[data-mobile-drawer-root]");

  expect(dialog).toBeInTheDocument();
  expect(backdrop).toBeInTheDocument();
  expect(panel).toBe(dialog);
  expect(root?.parentElement).toBe(document.body);
  expect(root).toHaveClass("fixed", "inset-0", "isolate", "z-[60]");
  expect(backdrop).toHaveClass("absolute", "inset-0", "z-0");
  expect(panel).toHaveClass(
    "absolute",
    "inset-x-0",
    "bottom-0",
    "top-[max(4rem,env(safe-area-inset-top))]",
    "z-10",
  );
  expect(panel).not.toHaveClass(
    "hidden",
    "invisible",
    "opacity-0",
    "pointer-events-none",
    "-translate-x-full",
    "translate-x-full",
  );
  expect(dialog).toHaveClass(
    "pt-4",
    "pb-[max(1rem,env(safe-area-inset-bottom))]",
  );
  expect(
    document.body.querySelector("[data-drawer-navigation]"),
  ).toHaveClass("py-6", "[&_nav>div]:mt-0");
  const closeButton = screen.getByRole("button", { name: "Close" });
  expect(closeButton).toHaveClass("h-11", "w-11");
  expect(closeButton).toBeEnabled();
  expect(closeButton).toHaveFocus();
  expect(container).toHaveProperty("inert", true);
  expect(screen.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
  expect(screen.getAllByRole("link")).toHaveLength(6);
  expect(document.body.style.overflow).toBe("hidden");

  await user.tab({ shift: true });
  expect(dialog).toContainElement(document.activeElement as HTMLElement);
  await user.keyboard("{Escape}");
  expect(screen.queryByRole("dialog", { name: "Menu" })).not.toBeInTheDocument();
  expect(document.body.querySelector("[data-mobile-drawer-backdrop]")).not.toBeInTheDocument();
  expect(document.body.querySelector("[data-mobile-drawer-panel]")).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
  expect(container).toHaveProperty("inert", false);
  expect(document.body.style.overflow).toBe("");
  expect(await axe(document.body)).toHaveNoViolations();
});

test("renders an enabled 44 by 44 button with no closed overlay", () => {
  render(<MobileNavDrawer />);
  const trigger = screen.getByRole("button", { name: "Open menu" });

  expect(trigger.tagName).toBe("BUTTON");
  expect(trigger).toBeEnabled();
  expect(trigger).not.toHaveAttribute("aria-disabled");
  expect(trigger).toHaveClass("min-h-11", "min-w-11");
  expect(trigger).not.toHaveClass("pointer-events-none", "opacity-0");
  expect(screen.queryByRole("dialog", { name: "Menu" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Close menu" })).not.toBeInTheDocument();
  expect(document.body.querySelector("[data-mobile-drawer-backdrop]")).not.toBeInTheDocument();
  expect(document.body.querySelector("[data-mobile-drawer-panel]")).not.toBeInTheDocument();
});

test.each([
  ["Enter", "{Enter}"],
  ["Space", " "],
])("%s opens the drawer from the trigger", async (_name, key) => {
  const user = userEvent.setup();
  render(<MobileNavDrawer />);
  const trigger = screen.getByRole("button", { name: "Open menu" });

  trigger.focus();
  await user.keyboard(key);

  expect(screen.getByRole("dialog", { name: "Menu" })).toBeInTheDocument();
  expect(trigger).toHaveAttribute("aria-expanded", "true");
});

test.each(["light", "dark"])(
  "%s mode keeps the trigger enabled and operable",
  async (mode) => {
    const user = userEvent.setup();
    document.documentElement.classList.toggle("dark", mode === "dark");
    render(<MobileNavDrawer />);
    const trigger = screen.getByRole("button", { name: "Open menu" });

    expect(trigger).toBeEnabled();
    await user.click(trigger);
    expect(screen.getByRole("dialog", { name: "Menu" })).toBeInTheDocument();
    expect(document.body.querySelector("[data-mobile-drawer-backdrop]")).toBeInTheDocument();
    expect(document.body.querySelector("[data-mobile-drawer-panel]")).toBeInTheDocument();

    document.documentElement.classList.remove("dark");
  },
);

test.each(["/home", "/projects", "/about", "/experience", "/contact"])(
  "uses the same operable shared-layout trigger on %s",
  async (pathname) => {
    const user = userEvent.setup();
    mockPathname = pathname;
    render(<MobileNavDrawer />);

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByRole("dialog", { name: "Menu" })).toBeInTheDocument();
  },
);

test("route selection closes the drawer", async () => {
  const user = userEvent.setup();
  mockPathname = "/";
  render(<MobileNavDrawer />);
  await user.click(screen.getByRole("button", { name: "Open menu" }));
  await user.click(screen.getByRole("link", { name: "About" }));
  expect(screen.queryByRole("dialog", { name: "Menu" })).not.toBeInTheDocument();
});
