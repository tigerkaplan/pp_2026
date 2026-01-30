"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";
type ThemeSetting = Theme | "system";

type ThemeContextValue = {
  theme: Theme;
  setting: ThemeSetting;
  setSetting: React.Dispatch<React.SetStateAction<ThemeSetting>>;
  toggleTheme: () => void;
  mounted: boolean;
};

const STORAGE_KEY = "theme";

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveTheme(setting: ThemeSetting): Theme {
  return setting === "system" ? getSystemTheme() : setting;
}

function readInitialSetting(): ThemeSetting {
  const v = window.localStorage.getItem(STORAGE_KEY);
  if (v === "light" || v === "dark" || v === "system") return v;
  return "system";
}

type LegacyMediaQueryList = MediaQueryList & {
  addListener?: (listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void) => void;
  removeListener?: (listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [setting, setSetting] = useState<ThemeSetting>("system");
  const [theme, setTheme] = useState<Theme>("light");

  const toggleTheme = useCallback(() => {
    setSetting((prev) => {
      if (prev === "system") return theme === "dark" ? "light" : "dark";
      return prev === "dark" ? "light" : "dark";
    });
  }, [theme]);

  useEffect(() => {
    setMounted(true);

    const initialSetting = readInitialSetting();
    setSetting(initialSetting);

    const initialTheme = resolveTheme(initialSetting);
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const apply = (t: Theme) => {
      setTheme(t);
      document.documentElement.classList.toggle("dark", t === "dark");
    };

    window.localStorage.setItem(STORAGE_KEY, setting);
    apply(resolveTheme(setting));

    if (setting !== "system") return;

    const mql = window.matchMedia("(prefers-color-scheme: dark)") as LegacyMediaQueryList;
    const onChange = () => apply(mql.matches ? "dark" : "light");

    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    }

    if (typeof mql.addListener === "function") {
      mql.addListener(onChange);
      return () => mql.removeListener?.(onChange);
    }
  }, [setting, mounted]);

  const value = useMemo(
    () => ({ theme, setting, setSetting, toggleTheme, mounted }),
    [theme, setting, toggleTheme, mounted]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
