import { act, render, within } from "@testing-library/react";
import { readFileSync } from "node:fs";
import path from "node:path";
import { TechnologyTags } from "./TechnologyTags";

const technologies = ["Next.js", "TypeScript", "SEO", "Testing"];
const boundaryTechnologies = Array.from({ length: 11 }, (_, index) => `Tag ${index + 1}`);
let rowWidth = 240;
let resizeCallbacks: ResizeObserverCallback[] = [];

beforeEach(() => {
  resizeCallbacks = [];
  jest.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    function getBoundingClientRect(this: HTMLElement) {
      const width =
        this.dataset.projectTechnologies !== undefined
          ? rowWidth
          : this.dataset.technologyMeasurement !== undefined
            ? 50
            : this.dataset.overflowMeasurement !== undefined
              ? Number(this.dataset.overflowMeasurement) <= 9
                ? 24
                : Number(this.dataset.overflowMeasurement) === 10
                  ? 32
                  : 48
              : 0;
      return {
        width,
        height: 24,
        top: 0,
        left: 0,
        right: width,
        bottom: 24,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      } as DOMRect;
    },
  );
  global.ResizeObserver = class ResizeObserverMock {
    constructor(callback: ResizeObserverCallback) {
      resizeCallbacks.push(callback);
    }

    observe() {}
    unobserve() {}
    disconnect() {}
  } as typeof ResizeObserver;
});

afterEach(() => {
  jest.restoreAllMocks();
});

function notifyResize() {
  act(() => {
    resizeCallbacks.forEach((callback) => callback([], {} as ResizeObserver));
  });
}

test("shows every tag and no overflow indicator when all tags fit", () => {
  const { container } = render(<TechnologyTags technologies={technologies} />);
  const row = container.querySelector<HTMLElement>("[data-project-technologies]")!;

  expect(row.textContent).toBe("Next.jsTypeScriptSEOTesting");
  expect(within(row).queryByRole("button")).not.toBeInTheDocument();
});

test("uses the available width to show complete ordered tags and a +N indicator", () => {
  rowWidth = 165;
  const { container } = render(<TechnologyTags technologies={technologies} />);
  const row = container.querySelector<HTMLElement>("[data-project-technologies]")!;

  expect(row.textContent).toBe("Next.jsTypeScript+2");
  const overflow = within(row).getByRole("button", {
    name: "2 additional technologies",
  });
  expect(overflow).toHaveTextContent("+2");
  expect(overflow).not.toHaveTextContent(/more/i);
  expect(overflow).toHaveAttribute("title", "2 additional technologies");
  expect(row).toHaveClass("flex-nowrap", "min-w-0");
  expect(row).not.toHaveClass("overflow-hidden");
  expect(within(row).getByText("Next.js")).toHaveClass(
    "rounded-full",
    "ring-1",
    "px-2.5",
    "py-1",
    "text-xs",
    "font-medium",
    "shrink-0",
  );
  expect(overflow.parentElement).toHaveClass("shrink-0");
  expect(container.querySelector("[data-technology-measurements]")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
});

test("recalculates visible tags as the container grows and shrinks", () => {
  rowWidth = 105;
  const { container } = render(<TechnologyTags technologies={technologies} />);
  const row = container.querySelector<HTMLElement>("[data-project-technologies]")!;

  expect(row.textContent).toBe("Next.js+3");

  rowWidth = 240;
  notifyResize();
  expect(row.textContent).toBe("Next.jsTypeScriptSEOTesting");
  expect(within(row).queryByRole("button")).not.toBeInTheDocument();

  rowWidth = 105;
  notifyResize();
  expect(row.textContent).toBe("Next.js+3");
});

test("reserves the true one-digit overflow width at the +9 boundary", () => {
  rowWidth = 85;
  const { container } = render(
    <TechnologyTags technologies={boundaryTechnologies.slice(0, 10)} />,
  );
  const row = container.querySelector<HTMLElement>("[data-project-technologies]")!;

  expect(row.textContent).toBe("Tag 1+9");
  expect(
    within(row).getByRole("button", { name: "9 additional technologies" }),
  ).toHaveTextContent("+9");
});

test("reserves the true two-digit overflow width at the +10 boundary", () => {
  rowWidth = 95;
  const { container } = render(<TechnologyTags technologies={boundaryTechnologies} />);
  const row = container.querySelector<HTMLElement>("[data-project-technologies]")!;

  expect(row.textContent).toBe("Tag 1+10");
  expect(
    within(row).getByRole("button", { name: "10 additional technologies" }),
  ).toHaveTextContent("+10");
});

test("does not retain a fixed technology visible-count slice", () => {
  const projectCard = readFileSync(
    path.join(process.cwd(), "app/(site)/projects/_components/ProjectCard.tsx"),
    "utf8",
  );

  expect(projectCard).not.toMatch(/technologies\.slice\(0,\s*\d+\)/);
});

test("measures full border-box tag widths from an isolated hidden layer", () => {
  const { container } = render(<TechnologyTags technologies={technologies} />);
  const measurements = container.querySelector("[data-technology-measurements]")!;

  expect(measurements).toHaveClass("absolute", "invisible", "pointer-events-none");
  expect(measurements).not.toContainElement(
    container.querySelector("[data-project-technologies]"),
  );
});
