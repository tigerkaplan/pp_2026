"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LABEL_MAP: Record<string, string> = {
  projects: "Projects",
  blog: "Blog",
  about: "About",
  contact: "Contact",
};

function toTitleCase(input: string) {
  return input.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatSegmentLabel(segment: string) {
  const decoded = decodeURIComponent(segment);
  return LABEL_MAP[decoded] ?? toTitleCase(decoded);
}

export function Breadcrumbs({ hideOnHome = true, maxItems = 4 }: { hideOnHome?: boolean; maxItems?: number }) {
  const pathname = usePathname();
  if (!pathname) return null;

  const segments = pathname.split("/").filter(Boolean);
  if (hideOnHome && segments.length === 0) return null;

  const crumbs = segments.map((seg, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const isLast = index === segments.length - 1;
    return { href, isLast, label: formatSegmentLabel(seg) };
  });

  // collapse: Home / A / … / Y / Z
  const shouldCollapse = crumbs.length + 1 > maxItems;
  const visible = !shouldCollapse ? crumbs : [crumbs[0], { href: "", label: "…", isLast: false } as any, ...crumbs.slice(-2)];

  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
        <li className="shrink-0">
          <Link href="/" className="hover:underline">
            Home
          </Link>
        </li>

        {visible.map((c, idx) => (
          <li key={`${c.href}-${idx}`} className="flex items-center gap-2 min-w-0">
            <span className="opacity-50">/</span>

            {c.href === "" ? (
              <span className="shrink-0">…</span>
            ) : c.isLast ? (
              <span className="font-medium text-black dark:text-white truncate">{c.label}</span>
            ) : (
              <Link href={c.href} className="hover:underline truncate">
                {c.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
