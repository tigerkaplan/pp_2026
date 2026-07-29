import { render, screen } from "@testing-library/react";
import { useRef } from "react";
import { useDialogFocus } from "./useDialogFocus";

function TestDialog({ name }: { name: string }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(true, dialogRef);

  return (
    <div ref={dialogRef} role="dialog" aria-label={name} tabIndex={-1}>
      <button type="button">Dialog action</button>
    </div>
  );
}

function DialogLifecycle({ dialogs }: { dialogs: string[] }) {
  return (
    <div>
      <header>
        <button type="button">Open menu</button>
      </header>
      {dialogs.map((name) => (
        <TestDialog key={name} name={name} />
      ))}
    </div>
  );
}

test("restores the mobile header after overlapping dialog lifecycles", () => {
  const { rerender } = render(<DialogLifecycle dialogs={["first"]} />);
  const trigger = screen.getByRole("button", { name: "Open menu" });

  expect(trigger.closest("header")).toHaveProperty("inert", true);

  rerender(<DialogLifecycle dialogs={["first", "second"]} />);
  expect(trigger.closest("header")).toHaveProperty("inert", true);

  rerender(<DialogLifecycle dialogs={["second"]} />);
  expect(trigger.closest("header")).toHaveProperty("inert", true);

  rerender(<DialogLifecycle dialogs={[]} />);
  expect(trigger.closest("header")).toHaveProperty("inert", false);
});

test("preserves an inert state that existed before the dialog opened", () => {
  const { rerender } = render(<DialogLifecycle dialogs={[]} />);
  const header = screen.getByRole("button", { name: "Open menu" }).closest("header");

  expect(header).not.toBeNull();
  if (!header) return;
  header.inert = true;

  rerender(<DialogLifecycle dialogs={["dialog"]} />);
  rerender(<DialogLifecycle dialogs={[]} />);

  expect(header).toHaveProperty("inert", true);
});
