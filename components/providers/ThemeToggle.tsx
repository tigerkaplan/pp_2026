"use client";

import { useTheme } from "@/components/providers/ThemeProvider";

export function ThemeToggle() {
  const { theme, setting, toggleTheme, setSetting, mounted } = useTheme();

  // Ensures server HTML matches first client render
  if (!mounted) return null;

  return (
    <div className="flex items-center gap-2">
      <button onClick={toggleTheme}>{theme === "dark" ? "Dark" : "Light"}</button>
      <button onClick={() => setSetting("system")} aria-pressed={setting === "system"}>
        System
      </button>
    </div>
  );
}
