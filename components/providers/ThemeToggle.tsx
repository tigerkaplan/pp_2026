// components/providers/ThemeToggle.tsx
"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "@/components/providers/ThemeProvider"; // ✅ use correct absolute path

function useIsHydrated() {
  return useSyncExternalStore(
    (cb) => {
      queueMicrotask(cb); // runs once after hydration
      return () => {};
    },
    () => true,  // client snapshot
    () => false  // server snapshot
  );
}

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const hydrated = useIsHydrated();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={toggleTheme}
        className="rounded-md border border-[rgb(var(--color-border))] px-3 py-2 text-sm"
        aria-label={hydrated ? `Switch to ${theme === "dark" ? "light" : "dark"} theme` : "Change colour theme"}
        aria-pressed={hydrated ? theme === "dark" : undefined}
        title={hydrated ? `Switch to ${theme === "dark" ? "light" : "dark"} theme` : "Change colour theme"}
      >
        {hydrated ? (theme === "dark" ? "Dark" : "Light") : "Theme"}
      </button>
    </div>
  );
}
