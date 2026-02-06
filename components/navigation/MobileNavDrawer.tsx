// components/navigation/MobileNavDrawer.tsx
"use client";

import { useEffect, useState } from "react";
import { MainNav } from "@/components/navigation/MainNav";

function HamburgerIcon() {
  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-[rgb(var(--color-surface-weak)_/_0.6)]">
      <span className="relative block h-4 w-5">
        <span className="absolute left-0 top-0 h-0.5 w-5 bg-current" />
        <span className="absolute left-0 top-1.5 h-0.5 w-5 bg-current" />
        <span className="absolute left-0 top-3 h-0.5 w-5 bg-current" />
      </span>
    </span>
  );
}

export default function MobileNavDrawer() {
  const [open, setOpen] = useState(false);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="lg:hidden text-[rgb(var(--color-fg))]"
      >
        <HamburgerIcon />
      </button>

      {open && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          {/* Backdrop */}
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/30"
          />

          {/* Full modal */}
          <div
            role="dialog"
            aria-modal="true"
            className="
              absolute inset-0
              backdrop-blur-2xl
              bg-[rgb(var(--color-bg)_/_0.4)]
              text-[rgb(var(--color-fg))]
            "
          >
            {/* Header (unchanged) */}
            <div
              className="
                sticky top-20 z-10
                flex items-center justify-between
                px-5 py-4
                border-b border-[rgb(var(--color-border))]
                bg-[rgb(var(--color-topbar-bg)_/_0.55)]
                backdrop-blur-xl
              "
            >
              <div className="text-base font-semibold tracking-tight">
                Menu
              </div>

              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="
                  h-10 w-10 rounded-md
                  border border-[rgb(var(--color-border))]
                  bg-[rgb(var(--color-surface-weak)_/_0.75)]
                  hover:bg-[rgb(var(--color-surface-weak))]
                "
              >
                ✕
              </button>
            </div>

            {/* LINKS AREA — darker text in light mode */}
            <div className="mx-auto max-w-screen-sm px-5 py-6">
              <div
                className="
                  rounded-2xl
                  border border-[rgb(var(--color-border))]
                  bg-black/20
                  backdrop-blur-lg
                  shadow-xl
                "
              >
                <div className="
                  p-3
                  text-neutral-900
                  dark:text-neutral-100
                ">
                  <MainNav onNavigate={() => setOpen(false)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
