"use client";

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

type Theme = "light" | "dark";
type ThemeSetting = Theme | "system";

type ThemeContextValue = {
    theme: Theme;
    setting: ThemeSetting;
    setSetting: React.Dispatch<React.SetStateAction<ThemeSetting>>;
    toggleTheme: () => void;
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

// Legacy Safari typings
type LegacyMediaQueryList = MediaQueryList & {
    addListener?: (listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void) => void;
    removeListener?: (listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [setting, setSetting] = useState<ThemeSetting>(() => {
        if (typeof window === "undefined") return "system";
        return readInitialSetting();
    });

    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window === "undefined") return "light";
        return resolveTheme(readInitialSetting());
    });

    const toggleTheme = useCallback(() => {
        setSetting((prev) => {
            if (prev === "system") return theme === "dark" ? "light" : "dark";
            return prev === "dark" ? "light" : "dark";
        });
    }, [theme]);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const apply = (t: Theme) => {
            setTheme(t);
            document.documentElement.classList.toggle("dark", t === "dark");
        };

        window.localStorage.setItem(STORAGE_KEY, setting);
        apply(resolveTheme(setting));

        if (setting !== "system") return;

        const mql = window.matchMedia("(prefers-color-scheme: dark)") as LegacyMediaQueryList;
        const onChange = () => apply(mql.matches ? "dark" : "light");

        // Prefer modern API when present
        if (typeof mql.addEventListener === "function") {
            mql.addEventListener("change", onChange);
            return () => mql.removeEventListener("change", onChange);
        }

        // Fallback: older Safari
        if (typeof mql.addListener === "function") {
            mql.addListener(onChange);
            return () => mql.removeListener?.(onChange);
        }
    }, [setting]);

    const value = useMemo(
        () => ({ theme, setting, setSetting, toggleTheme }),
        [theme, setting, toggleTheme]
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
    return ctx;
}
