// components/navigation/MobileNavDrawer.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MainNav } from "@/components/navigation/MainNav";
import { useDialogFocus } from "@/components/accessibility/useDialogFocus";

function HamburgerIcon() {
  return (
    <span
      className="
        inline-flex h-11 w-11 items-center justify-center rounded-md
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
        className="inline-flex min-h-11 min-w-11 rounded-md text-[rgb(var(--color-fg))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-focus))] lg:hidden"
      >
        <HamburgerIcon />
      </button>

      {open
        ? createPortal(
            <div
              className="fixed inset-0 z-[60] isolate overflow-hidden lg:hidden"
              data-mobile-drawer-root
            >
          {/* Backdrop (blurred) */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            data-mobile-drawer-backdrop
            className="
              absolute inset-0 z-0
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
            data-mobile-drawer-panel
            className="
              absolute inset-x-0 bottom-0 z-10
              top-[max(4rem,env(safe-area-inset-top))]
              min-h-0
              pointer-events-auto
              px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]
            "
          >
            <div
              className="
                flex h-full min-h-0 flex-col
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
                    inline-flex h-11 w-11 items-center justify-center rounded-md
                    border border-[rgb(var(--color-border))]
                    bg-[rgb(var(--color-surface-weak)_/_0.65)]
                    hover:bg-[rgb(var(--color-surface-weak))]
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-focus))]
                  "
                >
                  ✕
                </button>
              </div>

              {/* Links */}
              <div
                className="min-h-0 flex-1 overflow-y-auto px-5 py-6 text-2xl [&_nav>div]:mt-0"
                data-drawer-navigation
              >
                  <MainNav onNavigate={() => setOpen(false)} />
              </div>
            </div>
          </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
