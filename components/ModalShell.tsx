"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import CopyLinkButton from "@/app/(site)/projects/@modal/(.)[slug]/copy-link-button";
import { useDialogFocus } from "@/components/accessibility/useDialogFocus";

export default function ModalShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useDialogFocus(true, dialogRef, closeRef);

  const closeHref = useMemo(() => "/projects", []);
  const copyUrl = pathname;

  const close = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.replace(closeHref);
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);

    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center p-3 sm:p-6">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-[rgb(var(--color-overlay)/0.55)]"
        onClick={close}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative z-10 flex max-h-full w-full max-w-980px">
        <div
          ref={dialogRef}
          className={[
            "relative flex max-h-full w-full min-w-0 flex-col overflow-hidden rounded-2xl border shadow-xl backdrop-blur",
            "border-[rgb(var(--color-modal-border))]",
            "bg-[rgb(var(--color-modal-bg)/0.9)]",
            "text-[rgb(var(--color-modal-fg))]",
          ].join(" ")}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-dialog-title"
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className={[
              "flex items-start justify-between gap-3 border-b px-5 py-4",
              "border-[rgb(var(--color-modal-border))]",
            ].join(" ")}
          >
            <div className="min-w-0">
              <h2 id="project-dialog-title" className="text-base font-semibold text-[rgb(var(--color-modal-fg))]">
                {title}
              </h2>

              {subtitle ? (
                <p className="mt-1 text-sm text-[rgb(var(--color-modal-fg-muted))]">
                  {subtitle}
                </p>
              ) : null}
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-2">
              {actions}

              <CopyLinkButton url={copyUrl} />

              <button
                ref={closeRef}
                type="button"
                onClick={close}
                className={[
                  "rounded-md border px-3 py-2 text-sm transition",
                  "border-[rgb(var(--color-modal-border))]",
                  "text-[rgb(var(--color-modal-fg))]",
                  "hover:bg-[rgb(var(--color-surface)/0.25)]",
                  "focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-[rgb(var(--color-nav-active))]/40",
                ].join(" ")}
                aria-label="Close"
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Content */}
          <div
            className={[
              "min-h-0 overflow-auto px-5 py-4",
              // IMPORTANT: do NOT force buttons in content to become white.
              // Only normalize common text nodes:
              "[&_p]:text-[rgb(var(--color-modal-fg))]",
              "[&_li]:text-[rgb(var(--color-modal-fg))]",
              "[&_span]:text-[rgb(var(--color-modal-fg))]",
              "[&_h1]:text-[rgb(var(--color-modal-fg))]",
              "[&_h2]:text-[rgb(var(--color-modal-fg))]",
              "[&_h3]:text-[rgb(var(--color-modal-fg))]",
              "[&_h4]:text-[rgb(var(--color-modal-fg))]",
              "[&_small]:text-[rgb(var(--color-modal-fg-muted))]",
              "[&_.muted]:text-[rgb(var(--color-modal-fg-muted))]",
              "[&_a]:text-[rgb(var(--color-modal-fg))] [&_a]:underline [&_a]:underline-offset-4",
            ].join(" ")}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
