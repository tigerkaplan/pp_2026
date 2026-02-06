// components/navigation/NavLinks.tsx
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

type NavLinksProps = {
  onNavigate?: () => void;
};

export const NavLinks = ({ onNavigate }: NavLinksProps) => {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="h-full grid grid-cols-1 auto-rows-fr gap-2">
      {LINKS.map((item) => {
        const active = isActive(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={[
              // DO NOT change sizing
              "h-full rounded-lg border px-4",
              "flex items-center justify-between",
              "text-sm lg:text-base font-medium transition",

              // base color always
              "bg-[rgb(var(--color-surface-weak)_/_0.9)]",

              // hover ONLY when not active (so active stays darker)
              active ? "" : "hover:bg-[rgb(var(--color-surface-strong))]",

              // active stays darker
              active ? "bg-rgb(var(--color-surface-strong)]" : "",
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
