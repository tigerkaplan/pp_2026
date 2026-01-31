"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type BreadcrumbsProps = {
  /** If provided, replaces the label of the last segment (useful for dynamic slugs). */
  currentLabel?: string;
  /** Hide breadcrumbs on home route "/" */
  hideOnHome?: boolean;
  /** Max visible crumbs before collapsing with "…" */
  maxItems?: number;
};

const LABEL_MAP: Record<string, string> = {
  projects: "Projects",
  blog: "Blog",
  about: "About",
  contact: "Contact",
};

const ICON_MAP: Record<string, React.ReactNode> = {
  projects: <span aria-hidden>🧩</span>,
  blog: <span aria-hidden>✍️</span>,
};

function toTitleCase(input: string) {
  return input
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatSegmentLabel(segment: string) {
  const decoded = decodeURIComponent(segment);
  return LABEL_MAP[decoded] ?? toTitleCase(decoded);
}

export function Breadcrumbs({
  currentLabel,
  hideOnHome = true,
  maxItems = 4,
}: BreadcrumbsProps) {
  const pathname = usePathname();
  if (!pathname) return null;

  const segments = pathname.split("/").filter(Boolean);

  if (hideOnHome && segments.length === 0) return null;

  // Build crumbs
  const crumbs = segments.map((seg, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const isLast = index === segments.length - 1;

    const label =
      isLast && currentLabel ? currentLabel : formatSegmentLabel(seg);

    const icon = index === 0 ? ICON_MAP[decodeURIComponent(seg)] : null;

    return { href, label, isLast, icon };
  });

  // Collapse if too many items:
  // Home / A / … / Y / Z
  const shouldCollapse = crumbs.length + 1 > maxItems; // +1 for Home
  const visible =
    !shouldCollapse
      ? crumbs
      : [
          crumbs[0],
          { href: "", label: "…", isLast: false, icon: null, isEllipsis: true } as any,
          ...crumbs.slice(-2),
        ];

  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <li className="shrink-0">
          <Link href="/" className="hover:underline">
            Home
          </Link>
        </li>

        {visible.map((c, idx) => (
          <li key={`${c.href}-${idx}`} className="flex items-center gap-2 min-w-0">
            <span className="opacity-50">/</span>

            {"isEllipsis" in c && c.isEllipsis ? (
              <span className="shrink-0">…</span>
            ) : c.isLast ? (
              <span className="font-medium text-foreground truncate">
                <span className="inline-flex items-center gap-2">
                  {c.icon ? <span className="shrink-0">{c.icon}</span> : null}
                  {c.label}
                </span>
              </span>
            ) : (
              <Link href={c.href} className="hover:underline truncate">
                <span className="inline-flex items-center gap-2">
                  {c.icon ? <span className="shrink-0">{c.icon}</span> : null}
                  {c.label}
                </span>
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
