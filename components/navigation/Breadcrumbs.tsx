"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type BreadcrumbsProps = {
  currentLabel?: string;
  hideOnHome?: boolean;
  maxItems?: number;
};

const LABEL_MAP: Record<string, string> = {
  projects: "Projects",
  blog: "Blog",
  about: "About",
  contact: "Contact",
};

const ICON_MAP: Record<string, ReactNode> = {
  projects: <span aria-hidden>🧩</span>,
  blog: <span aria-hidden>✍️</span>,
};

function toTitleCase(input: string) {
  return input.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatSegmentLabel(segment: string) {
  const decoded = decodeURIComponent(segment);
  return LABEL_MAP[decoded] ?? toTitleCase(decoded);
}

type Crumb = {
  kind: "crumb";
  href: string;
  label: string;
  isLast: boolean;
  icon: ReactNode | null;
};

type EllipsisCrumb = {
  kind: "ellipsis";
};

type VisibleItem = Crumb | EllipsisCrumb;

export function Breadcrumbs({
  currentLabel,
  hideOnHome = true,
  maxItems = 4,
}: BreadcrumbsProps) {
  const pathname = usePathname();
  if (!pathname) return null;

  const segments = pathname.split("/").filter(Boolean);
  if (hideOnHome && segments.length === 0) return null;

  const crumbs: Crumb[] = segments.map((seg, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const isLast = index === segments.length - 1;

    const label = isLast && currentLabel ? currentLabel : formatSegmentLabel(seg);
    const icon = index === 0 ? ICON_MAP[decodeURIComponent(seg)] ?? null : null;

    return { kind: "crumb", href, label, isLast, icon };
  });

  const shouldCollapse = crumbs.length + 1 > maxItems; // +1 for Home

  const visible: VisibleItem[] = !shouldCollapse
    ? crumbs
    : [crumbs[0], { kind: "ellipsis" }, ...crumbs.slice(-2)];

  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-[rgb(var(--color-fg-muted))] lg:text-[15px]">
        <li className="shrink-0">
          <Link href="/" className="hover:underline">
            Home
          </Link>
        </li>

        {visible.map((item, idx) => (
          <li key={`${item.kind}-${idx}`} className="flex items-center gap-2 min-w-0">
            <span className="opacity-50">/</span>

            {item.kind === "ellipsis" ? (
              <span className="shrink-0">…</span>
            ) : item.isLast ? (
              <span className="font-medium text-[rgb(var(--color-fg))] truncate">
                <span className="inline-flex items-center gap-2">
                  {item.icon ? <span className="shrink-0">{item.icon}</span> : null}
                  {item.label}
                </span>
              </span>
            ) : (
              <Link href={item.href} className="hover:underline truncate">
                <span className="inline-flex items-center gap-2">
                  {item.icon ? <span className="shrink-0">{item.icon}</span> : null}
                  {item.label}
                </span>
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
