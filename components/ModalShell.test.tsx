import Link from "next/link";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import ModalShell from "./ModalShell";

const back = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => "/projects/example",
  useRouter: () => ({ back, replace: jest.fn() }),
}));

test("provides a named, scrollable, focus-managed project dialog", async () => {
  window.history.replaceState({}, "", "/projects/example");
  window.history.pushState({}, "", "/projects");

  const user = userEvent.setup();
  const { container, unmount } = render(
    <div><button>Project preview</button><ModalShell title="Example project" actions={<Link href="/projects/example">View full case study</Link>}><h3>Summary</h3><p>Project content</p></ModalShell></div>,
  );
  const dialog = screen.getByRole("dialog", { name: "Example project" });
  expect(dialog).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();
  expect(screen.getByRole("link", { name: "View full case study" })).toHaveAttribute("href", "/projects/example");
  await user.tab({ shift: true });
  expect(dialog).toContainElement(document.activeElement as HTMLElement);
  expect(await axe(container)).toHaveNoViolations();
  await user.keyboard("{Escape}");
  expect(back).toHaveBeenCalled();
  unmount();
});
