"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/app/(site)/projects/_types/project";

export default function OnThisPageProjects({ projects }: { projects: Project[] }) {
  const [open, setOpen] = useState(true);
  const [slideDown, setSlideDown] = useState(false);

  const lastY = useRef(0);
  const raf = useRef<number | null>(null);

  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      if (raf.current) return;

      raf.current = window.requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY.current;

        if (Math.abs(delta) > 8) {
          setSlideDown(delta > 0);
          lastY.current = y;
        }

        raf.current = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (raf.current) window.cancelAnimationFrame(raf.current);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const panelClass = [
    "rounded-2xl border shadow-sm transition-all duration-300 backdrop-blur",
    "border-[rgb(var(--color-border))]",
    "bg-[rgb(var(--color-topbar-bg)/0.75)] supports-[backdrop-filter]:bg-[rgb(var(--color-topbar-bg)/0.6)]",
    slideDown ? "translate-y-6" : "translate-y-0",
    open ? "max-h-[70vh]" : "max-h-12",
  ].join(" ");

  const headerText = "text-base font-semibold text-[rgb(var(--color-fg))]";
  const subText = "text-sm text-[rgb(var(--color-fg-muted))]";

  const sectionLabel = "mb-2 text-sm font-medium text-[rgb(var(--color-fg-muted))]";

  const anchorClass =
    "block rounded-md px-2 py-2 text-sm text-[rgb(var(--color-fg-muted))] lg:text-[15px] " +
    "hover:bg-[rgb(var(--color-surface)/0.35)] hover:text-[rgb(var(--color-fg))]";

  const dividerClass = "my-3 border-t border-[rgb(var(--color-border))]";

  const linkClass =
    "block rounded-md px-2 py-2 text-sm text-[rgb(var(--color-fg-muted))] lg:text-[15px] " +
    "hover:bg-[rgb(var(--color-surface)/0.35)] hover:text-[rgb(var(--color-fg))]";

  return (
    <aside className="fixed right-6 top-24 z-40 hidden w-72 min-[1800px]:block">
      <div className={panelClass}>
        {/* Header / Toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between px-4 py-3"
          aria-expanded={open}
        >
          <span className={headerText}>On this page</span>
          <span className={subText}>{open ? "Hide" : "Show"}</span>
        </button>

        {/* Body */}
        {open && (
          <div className="max-h-[calc(70vh-3rem)] overflow-y-auto px-2 pb-3">
            {/* Sections (anchors) */}
            <div className="px-2 pt-1">
              <p className={sectionLabel}>Sections</p>

              <div className="space-y-1">
                <a href="#featured-projects" className={anchorClass}>
                  Featured Projects
                </a>
                <a href="#all-projects" className={anchorClass}>
                  All Projects
                </a>
              </div>
            </div>

            <div className={dividerClass} />

            {/* Projects list (links to slug pages) */}
            <div className="px-2">
              <p className={sectionLabel}>Featured</p>
              <ul className="space-y-1">
                {featured.map((p) => (
                  <li key={p.id}>
                    <Link href={`/projects/${p.slug}`} className={linkClass}>
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className={dividerClass} />

              <p className={sectionLabel}>All projects</p>
              <ul className="space-y-1">
                {rest.map((p) => (
                  <li key={p.id}>
                    <Link href={`/projects/${p.slug}`} className={linkClass}>
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
