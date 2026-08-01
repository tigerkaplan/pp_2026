import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TechnologyOverflow } from "./TechnologyOverflow";

test("reveals hidden technologies and closes with Escape", async () => {
  const user = userEvent.setup();
  render(
    <TechnologyOverflow
      technologies={["MS SQL Server", "Tailwind", "Docker"]}
    />,
  );

  const trigger = screen.getByRole("button", {
    name: "3 additional technologies",
  });
  await user.click(trigger);

  expect(trigger).toHaveAttribute("aria-expanded", "true");
  expect(
    screen.getByRole("region", { name: "Additional technologies" }),
  ).toHaveTextContent("MS SQL ServerTailwindDocker");

  await user.keyboard("{Escape}");
  expect(
    screen.queryByRole("region", { name: "Additional technologies" }),
  ).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
});

test("closes from an outside pointer target", async () => {
  const user = userEvent.setup();
  render(
    <div>
      <TechnologyOverflow technologies={["React", "Tailwind"]} />
      <button type="button">Outside</button>
    </div>,
  );

  await user.click(
    screen.getByRole("button", { name: "2 additional technologies" }),
  );
  await user.click(screen.getByRole("button", { name: "Outside" }));

  expect(
    screen.queryByRole("region", { name: "Additional technologies" }),
  ).not.toBeInTheDocument();
});
