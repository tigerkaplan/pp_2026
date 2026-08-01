// components/providers/ThemeToggle.tsx
"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";

function useIsHydrated() {
  return useSyncExternalStore(
    (callback) => {
      queueMicrotask(callback);
      return () => {};
    },
    () => true,
    () => false
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      data-theme-icon="moon"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      data-theme-icon="sun"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const hydrated = useIsHydrated();
  const isDark = theme === "dark";
  const actionLabel = isDark ? "Switch to light mode" : "Switch to dark mode";
  const pendingLabel = "Change colour theme";

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={toggleTheme}
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-[rgb(var(--color-border))] text-[rgb(var(--color-fg))] hover:bg-[rgb(var(--color-surface-weak)/0.8)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-focus))]"
        aria-label={hydrated ? actionLabel : pendingLabel}
        aria-pressed={hydrated ? isDark : undefined}
        title={hydrated ? actionLabel : pendingLabel}
      >
        {hydrated ? (
          isDark ? <SunIcon /> : <MoonIcon />
        ) : (
          <>
            <span className="dark:hidden">
              <MoonIcon />
            </span>
            <span className="hidden dark:block">
              <SunIcon />
            </span>
          </>
        )}
      </button>
    </div>
  );
}
