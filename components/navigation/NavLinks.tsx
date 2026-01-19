"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Experience", href: "/experience" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const NavLinks = () => {
  const pathname = usePathname();

  // 🔽 BURAYA
  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");

  const activeHref = LINKS.find((l) => isActive(l.href))?.href;

  return (
    <div className="h-full grid grid-cols-1 auto-rows-fr gap-2">
      {LINKS.map((item) => {
        const active = item.href === activeHref;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={[
              "h-full rounded-lg border px-4",
              "flex items-center justify-between",
              "text-sm lg:text-base font-medium transition",
              active
                ? "opacity-100 bg-muted/40 ring-1 ring-foreground/10"
                : activeHref
                ? "opacity-35 hover:opacity-70"
                : "opacity-100 hover:bg-muted/20",
            ].join(" ")}
          >
            <span className="truncate">{item.label}</span>
            {active && (
              <span className="text-xs opacity-70">Current</span>
            )}
          </Link>
        );
      })}
    </div>
  );
};
