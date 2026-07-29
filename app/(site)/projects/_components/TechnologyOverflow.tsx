"use client";

import { useEffect, useId, useRef, useState } from "react";

export function TechnologyOverflow({
  technologies,
}: {
  technologies: string[];
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

  if (technologies.length === 0) return null;

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`${technologies.length} more technologies`}
        onClick={() => setOpen((current) => !current)}
        className="min-h-8 whitespace-nowrap rounded-full bg-[rgb(var(--color-surface-weak)/0.78)] px-2.5 py-1 text-xs font-medium text-[rgb(var(--color-fg))] ring-1 ring-[rgb(var(--color-border))] backdrop-blur focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-focus))] sm:text-sm"
      >
        +{technologies.length} more
      </button>

      {open ? (
        <div
          id={panelId}
          role="region"
          aria-label="More technologies"
          className="absolute bottom-full left-0 z-20 mb-2 w-max max-w-[min(16rem,calc(100vw-2rem))] rounded-lg border border-[rgb(var(--color-card-border))] bg-[rgb(var(--color-card-surface))] p-3 shadow-xl sm:left-auto sm:right-0"
        >
          <ul className="space-y-1 text-sm leading-5 text-[rgb(var(--color-fg))]">
            {technologies.map((technology) => (
              <li key={technology}>{technology}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
