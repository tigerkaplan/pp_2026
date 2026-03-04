// components/navigation/MobileNavDrawer.tsx
"use client";

import { useEffect, useState } from "react";
import { MainNav } from "@/components/navigation/MainNav";

function HamburgerIcon() {
  return (
    <span
      className="
        inline-flex w-10 items-center justify-center rounded-md
        bg-[rgb(var(--color-surface-weak)_/_0.6)]
        hover:bg-[rgb(var(--color-surface-weak)_/_0.75)]
      "
    >
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

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="lg:hidden text-[rgb(var(--color-fg))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-border))] rounded-md"
      >
        <HamburgerIcon />
      </button>

      {open && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          {/* Backdrop (blurred) */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="
              absolute inset-0
              bg-black/40
              backdrop-blur-md
            "
          />

          {/* Drawer */}
          <div
            role="dialog"
            aria-modal="true"
            className="
              absolute inset-x-0 top-0
              mt-20
              h-[calc(100dvh-5rem)]
              px-4 pb-6
            "
          >
            <div
              className="
                h-full
                rounded-2xl
                border border-[rgb(var(--color-border))]
                bg-[rgb(var(--color-bg)_/_0.85)]
                backdrop-blur-2xl
                shadow-2xl
                overflow-hidden
                text-[rgb(var(--color-fg))]
              "
            >
              {/* Header */}
              <div
                className="
                  flex items-center justify-between
                  px-5 py-4
                  border-b border-[rgb(var(--color-border))]
                  bg-[rgb(var(--color-topbar-bg)_/_0.65)]
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
                    inline-flex h-9 w-9 items-center justify-center rounded-md
                    border border-[rgb(var(--color-border))]
                    bg-[rgb(var(--color-surface-weak)_/_0.65)]
                    hover:bg-[rgb(var(--color-surface-weak))]
                    focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-border))]
                  "
                >
                  ✕
                </button>
              </div>

              {/* Links */}
              <div className="h-full overflow-y-auto px-5 py-6">
                <nav className="text-2xl">
                  <MainNav onNavigate={() => setOpen(false)} />
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}