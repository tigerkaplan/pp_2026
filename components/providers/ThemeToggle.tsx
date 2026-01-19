"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, setting, toggleTheme, setSetting } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleTheme}
        className="rounded-md border px-3 py-1 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
      </button>

      <button
        onClick={() => setSetting("system")}
        className="rounded-md border px-2 py-1 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800"
        aria-pressed={setting === "system"}
        title="Use system theme"
      >
        System
      </button>
    </div>
  );
}
