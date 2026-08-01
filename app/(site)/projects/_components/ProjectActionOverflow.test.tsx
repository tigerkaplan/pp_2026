import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProjectActionOverflow } from "./ProjectActionOverflow";

const actions = [
  {
    label: "View full project",
    href: "/projects/accessible-project",
    ariaLabel: "View full project: Accessible project",
  },
];

test("reveals hidden project actions and returns focus after Escape", async () => {
  const user = userEvent.setup();
  render(<ProjectActionOverflow actions={actions} />);

  const trigger = screen.getByRole("button", {
    name: "1 more project action",
  });
  await user.click(trigger);

  expect(trigger).toHaveAttribute("aria-expanded", "true");
  expect(
    screen.getByRole("region", { name: "More project actions" }),
  ).toContainElement(
    screen.getByRole("link", {
      name: "View full project: Accessible project",
    }),
  );

  await user.keyboard("{Escape}");
  expect(
    screen.queryByRole("region", { name: "More project actions" }),
  ).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
});

test("closes action overflow from an outside pointer target", async () => {
  const user = userEvent.setup();
  render(
    <div>
      <ProjectActionOverflow actions={actions} />
      <button type="button">Outside</button>
    </div>,
  );

  await user.click(
    screen.getByRole("button", { name: "1 more project action" }),
  );
  await user.click(screen.getByRole("button", { name: "Outside" }));

  expect(
    screen.queryByRole("region", { name: "More project actions" }),
  ).not.toBeInTheDocument();
});

test("preserves the exact hidden count, order and destinations", async () => {
  const user = userEvent.setup();
  render(
    <ProjectActionOverflow
      actions={[
        {
          label: "GitHub",
          href: "https://github.com/example/project",
          external: true,
        },
        {
          label: "View full project",
          href: "/projects/accessible-project",
          ariaLabel: "View full project: Accessible project",
        },
      ]}
    />,
  );

  await user.click(
    screen.getByRole("button", { name: "2 more project actions" }),
  );

  const hiddenLinks = screen.getAllByRole("link");
  expect(hiddenLinks.map((link) => link.textContent)).toEqual([
    "GitHub",
    "View full project",
  ]);
  expect(hiddenLinks[0]).toHaveAttribute(
    "href",
    "https://github.com/example/project",
  );
  expect(hiddenLinks[0]).toHaveAttribute("target", "_blank");
  expect(hiddenLinks[1]).toHaveAttribute(
    "href",
    "/projects/accessible-project",
  );
});
