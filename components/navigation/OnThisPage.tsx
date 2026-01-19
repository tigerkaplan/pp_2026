"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/app/projects/_types/project";

export default function OnThisPageProjects({
  projects,
}: {
  projects: Project[];
}) {
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
          // scroll down => slide down, scroll up => back
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

  return (
    <aside className="fixed right-6 top-24 z-40 hidden w-72 lg:block">
      <div
        className={[
          "rounded-2xl border border-neutral-200 bg-white/80 backdrop-blur shadow-sm transition-all duration-300",
          slideDown ? "translate-y-6" : "translate-y-0",
          open ? "max-h-[70vh]" : "max-h-12",
        ].join(" ")}
      >
        {/* Header / Toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between px-4 py-3"
          aria-expanded={open}
        >
          <span className="text-sm font-semibold text-neutral-900">
            On this page
          </span>
          <span className="text-xs text-neutral-600">
            {open ? "Hide" : "Show"}
          </span>
        </button>

        {/* Body */}
        {open && (
          <div className="max-h-[calc(70vh-3rem)] overflow-y-auto px-2 pb-3">
            {/* Sections (anchors) */}
            <div className="px-2 pt-1">
              <p className="mb-2 text-xs font-medium text-neutral-500">
                Sections
              </p>

              <div className="space-y-1">
                <a
                  href="#featured-projects"
                  className="block rounded-md px-2 py-1 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
                >
                  Featured Projects
                </a>
                <a
                  href="#all-projects"
                  className="block rounded-md px-2 py-1 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
                >
                  All Projects
                </a>
              </div>
            </div>

            <div className="my-3 border-t border-neutral-200" />

            {/* Projects list (links to slug pages) */}
            <div className="px-2">
              <p className="mb-2 text-xs font-medium text-neutral-500">
                Featured
              </p>
              <ul className="space-y-1">
                {featured.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/projects/${p.slug}`}
                      className="block rounded-md px-2 py-1 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
                    >
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="my-3 border-t border-neutral-200" />

              <p className="mb-2 text-xs font-medium text-neutral-500">
                All projects
              </p>
              <ul className="space-y-1">
                {rest.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/projects/${p.slug}`}
                      className="block rounded-md px-2 py-1 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
                    >
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
