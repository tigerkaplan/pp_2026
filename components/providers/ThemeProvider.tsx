// components/providers/ThemeProvider.tsx
"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

type Theme = "light" | "dark";
type ThemeSetting = Theme | "system";

type ThemeContextValue = {
  /** resolved theme (light/dark) */
  theme: Theme;
  /** user setting (light/dark/system) */
  setting: ThemeSetting;
  setSetting: (s: ThemeSetting) => void;
  toggleTheme: () => void; // toggles light<->dark (exits system)
  cycleSetting: () => void; // cycles system -> light -> dark
};

const STORAGE_KEY = "theme";

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// ---- system theme subscription (NO setState inside effects) ----
function subscribeToSystemTheme(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia("(prefers-color-scheme: dark)");

  // modern
  if (typeof mql.addEventListener === "function") {
    mql.addEventListener("change", cb);
    return () => mql.removeEventListener("change", cb);
  }
  // legacy
  const legacyMediaQueryList = mql as typeof mql & {
    addListener?: (listener: EventListener) => void;
    removeListener?: (listener: EventListener) => void;
  };
  if (typeof legacyMediaQueryList.addListener === "function") {
    legacyMediaQueryList.addListener(cb);
    return () => legacyMediaQueryList.removeListener?.(cb);
  }
  return () => {};
}

function getSystemSnapshot(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getServerSnapshot(): Theme {
  return "light";
}

// ---- localStorage helpers ----
function readStoredSetting(): ThemeSetting | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {
    return null;
  }
  return null;
}

function writeStoredSetting(setting: ThemeSetting) {
  try {
    window.localStorage.setItem(STORAGE_KEY, setting);
  } catch {
    // Storage can be unavailable in privacy modes; the in-memory choice still works.
  }
}

function resolveTheme(setting: ThemeSetting, systemTheme: Theme): Theme {
  return setting === "system" ? systemTheme : setting;
}

function applyHtmlThemeClass(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function ThemeProvider({
  children,
  defaultSetting = "system",
}: {
  children: React.ReactNode;
  /** first-load default if nothing in localStorage */
  defaultSetting?: ThemeSetting;
}) {
  const systemTheme = useSyncExternalStore(
    subscribeToSystemTheme,
    getSystemSnapshot,
    getServerSnapshot
  );

  const [setting, _setSetting] = useState<ThemeSetting>(() => {
    return defaultSetting;
  });

  useEffect(() => {
    const saved = readStoredSetting();
    if (saved) queueMicrotask(() => _setSetting(saved));
  }, []);

  const setSetting = useCallback((s: ThemeSetting) => {
    _setSetting(s);
  }, []);

  const theme = useMemo(() => resolveTheme(setting, systemTheme), [setting, systemTheme]);

  // Side effects only: sync external systems (html class + localStorage)
  useEffect(() => {
    if (typeof window === "undefined") return;
    applyHtmlThemeClass(theme);
    writeStoredSetting(setting);
  }, [theme, setting]);

  const toggleTheme = useCallback(() => {
    _setSetting((prev) => {
      const resolved = resolveTheme(prev, getSystemSnapshot());
      return resolved === "dark" ? "light" : "dark";
    });
  }, []);

  const cycleSetting = useCallback(() => {
    _setSetting((prev) => (prev === "system" ? "light" : prev === "light" ? "dark" : "system"));
  }, []);

  const value = useMemo(
    () => ({ theme, setting, setSetting, toggleTheme, cycleSetting }),
    [theme, setting, setSetting, toggleTheme, cycleSetting]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
