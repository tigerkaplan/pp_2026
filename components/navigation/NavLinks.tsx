// components/navigation/NavLinks.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Skills", href: "/skills" },
  { label: "Projects", href: "/projects" },
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
    <div className="h-full grid grid-cols-1 gap-4">
      {LINKS.map((item) => {
        const active = isActive(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={[
  "h-full rounded-lg border px-4",
  "flex items-center justify-between",
  "text-base leading-6 font-medium transition p-5 lg:text-[17px]",

  // base color always (non-active)
  !active && "bg-[rgb(var(--color-surface-weak)_/_0.9)]",

  // hover ONLY when not active
  !active && "hover:bg-[rgb(var(--color-surface))]",

  // active: darker background + stronger border
  active && "bg-[rgb(var(--color-nav-active))] border-[rgb(var(--color-nav-active))] text-[rgb(var(--color-nav-active-fg))]",
]
  .filter(Boolean)
  .join(" ")}
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
