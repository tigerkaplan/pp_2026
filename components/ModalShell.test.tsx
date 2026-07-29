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

beforeEach(() => {
  back.mockClear();
});

test("provides a named, scrollable, focus-managed project dialog", async () => {
  window.history.replaceState({}, "", "/projects/example");
  window.history.pushState({}, "", "/projects");

  const user = userEvent.setup();
  const { container, unmount } = render(
    <div><button>Project preview</button><ModalShell title="Example project" actions={<Link href="/projects/example">View full case study</Link>}><h3>Summary</h3><p>Project content</p></ModalShell></div>,
  );
  const dialog = screen.getByRole("dialog", { name: "Example project" });
  const fullPageAction = screen.getByRole("link", { name: "View full case study" });
  expect(dialog).toBeInTheDocument();
  expect(dialog.parentElement).toHaveClass(
    "w-[calc(100vw-2rem)]",
    "max-w-[900px]",
    "max-h-[calc(100dvh-2rem)]",
  );
  expect(dialog.querySelector(".overflow-y-auto")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();
  expect(fullPageAction).toHaveAttribute("href", "/projects/example");
  expect(fullPageAction.parentElement).toHaveClass("flex-wrap");
  await user.tab({ shift: true });
  expect(dialog).toContainElement(document.activeElement as HTMLElement);
  expect(await axe(container)).toHaveNoViolations();
  await user.keyboard("{Escape}");
  expect(back).toHaveBeenCalled();
  unmount();
});

test("closes from the close button and backdrop", async () => {
  const user = userEvent.setup();
  const { container } = render(
    <ModalShell title="Example project">
      <p>Project content</p>
    </ModalShell>,
  );

  await user.click(screen.getByRole("button", { name: "Close" }));
  await user.click(
    container.querySelector('[aria-hidden="true"]') as HTMLElement,
  );

  expect(back).toHaveBeenCalledTimes(2);
});
