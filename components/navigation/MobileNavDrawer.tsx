// components/navigation/MobileNavDrawer.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { MainNav } from "@/components/navigation/MainNav";
import { useDialogFocus } from "@/components/accessibility/useDialogFocus";

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
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useDialogFocus(open, dialogRef, closeRef);

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
        aria-controls="mobile-navigation-dialog"
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
            id="mobile-navigation-dialog"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-navigation-title"
            tabIndex={-1}
            className="
              absolute inset-x-0 top-0
              mt-16
              max-h-[calc(100dvh-4rem)]
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
                <div id="mobile-navigation-title" className="text-base font-semibold tracking-tight">
                  Menu
                </div>

                <button
                  ref={closeRef}
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
              <div className="min-h-0 overflow-y-auto px-5 py-6 text-2xl">
                  <MainNav onNavigate={() => setOpen(false)} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
