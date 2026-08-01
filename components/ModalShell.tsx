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
    <div className="fixed inset-0 z-1000 flex items-center justify-center p-4 sm:p-6">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-[rgb(var(--color-overlay)/0.55)]"
        onClick={close}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative z-10 flex w-[calc(100vw-2rem)] max-h-[calc(100dvh-2rem)] max-w-[900px] sm:max-h-[calc(100dvh-3rem)]">
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
              "flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-start sm:justify-between",
              "border-[rgb(var(--color-modal-border))]",
            ].join(" ")}
          >
            <div className="min-w-0">
              <h2 id="project-dialog-title" className="text-xl font-semibold leading-7 text-[rgb(var(--color-modal-fg))] sm:text-2xl sm:leading-8">
                {title}
              </h2>

              {subtitle ? (
                <p className="mt-1 text-sm leading-6 text-[rgb(var(--color-modal-fg-muted))] sm:text-base">
                  {subtitle}
                </p>
              ) : null}
            </div>

            {/* ACTIONS */}
            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
              {actions}

              <CopyLinkButton url={copyUrl} />

              <button
                ref={closeRef}
                type="button"
                onClick={close}
                className={[
                  "rounded-md border px-3 py-2 text-sm transition sm:text-base",
                  "border-[rgb(var(--color-modal-border))]",
                  "text-[rgb(var(--color-modal-fg))]",
                  "hover:bg-[rgb(var(--color-surface)/0.25)]",
                  "focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-[rgb(var(--color-focus))]",
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
              "min-h-0 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5",
              // IMPORTANT: do NOT force buttons in content to become white.
              // Only normalize common text nodes:
              "[&_p]:text-[rgb(var(--color-modal-fg))] [&_p]:leading-7",
              "[&_li]:text-[rgb(var(--color-modal-fg))] [&_li]:leading-6",
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
