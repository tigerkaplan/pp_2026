"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";

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

  // If user opened modal URL directly, there may be no "back" entry that returns to /projects
  const closeHref = useMemo(() => "/projects", []);

  const close = () => {
    // heuristic: if this isn't the first entry, back usually works
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

    // optional: lock scroll behind modal
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div className="fixed inset-0 z-1000">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-yellow/60"
        onClick={close}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="absolute inset-x-0 top-10 mx-auto w-[min(980px,calc(100%-24px))]">
        <div
          className="relative z-10 overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/90 shadow-xl backdrop-blur"
          role="dialog"
          aria-modal="true"
          aria-label={typeof title === "string" ? title : "Project preview"}
          onClick={(e) => e.stopPropagation()} // prevent overlay close when clicking inside
        >
          <div className="flex items-start justify-between gap-3 border-b border-white/10 px-5 py-4">
            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold text-white">
                {title}
              </h2>
              {subtitle ? (
                <p className="mt-1 text-sm text-white/60">{subtitle}</p>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              {actions}
              <button
                type="button"
                onClick={close}
                className="rounded-md border border-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white"
                aria-label="Close"
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="max-h-[75vh] overflow-auto px-5 py-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
