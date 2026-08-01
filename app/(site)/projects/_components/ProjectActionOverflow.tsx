"use client";

import { useEffect, useId, useRef, useState } from "react";

export type ProjectOverflowAction = {
  label: string;
  href: string;
  ariaLabel?: string;
  external?: boolean;
};

export function ProjectActionOverflow({
  actions,
}: {
  actions: ProjectOverflowAction[];
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;

    const closeFromOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const closeFromEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", closeFromOutside);
    document.addEventListener("keydown", closeFromEscape);
    return () => {
      document.removeEventListener("pointerdown", closeFromOutside);
      document.removeEventListener("keydown", closeFromEscape);
    };
  }, [open]);

  if (actions.length === 0) return null;

  const countLabel = `${actions.length} more project ${
    actions.length === 1 ? "action" : "actions"
  }`;

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={countLabel}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-md border border-[rgb(var(--color-card-border))] bg-[rgb(var(--color-surface-weak)/0.55)] px-2 py-2 text-sm font-medium leading-5 text-[rgb(var(--color-fg))] hover:bg-[rgb(var(--color-surface-weak)/0.8)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-focus))]"
      >
        +{actions.length} more
      </button>

      {open ? (
        <div
          id={panelId}
          role="region"
          aria-label="More project actions"
          className="absolute bottom-full right-0 z-20 mb-2 min-w-44 rounded-lg border border-[rgb(var(--color-card-border))] bg-[rgb(var(--color-card-surface))] p-2 shadow-xl"
        >
          <ul className="space-y-1">
            {actions.map((action) => (
              <li key={`${action.label}-${action.href}`}>
                <a
                  href={action.href}
                  aria-label={action.ariaLabel}
                  target={action.external ? "_blank" : undefined}
                  rel={action.external ? "noreferrer" : undefined}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-[rgb(var(--color-fg))] hover:bg-[rgb(var(--color-surface-weak)/0.8)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-focus))]"
                >
                  {action.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
