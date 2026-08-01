export const THEME_STORAGE_KEY = "theme";

export type Theme = "light" | "dark";
export type ThemeSetting = Theme | "system";

export function parseThemeSetting(value: unknown): ThemeSetting | null {
  return value === "light" || value === "dark" || value === "system"
    ? value
    : null;
}

export function resolveTheme(
  setting: ThemeSetting | null,
  systemTheme: Theme,
): Theme {
  return setting === "dark" || setting === "light" ? setting : systemTheme;
}

export function readStoredThemeSetting(
  storage: Pick<Storage, "getItem">,
): ThemeSetting | null {
  try {
    return parseThemeSetting(storage.getItem(THEME_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function applyThemeToRoot(root: HTMLElement, theme: Theme) {
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

/*
 * This intentionally stays dependency-free and synchronous. It runs in the
 * document head before body content is painted, using the same storage key and
 * resolution order as ThemeProvider.
 */
export const THEME_BOOTSTRAP_SCRIPT = `(()=>{let s=null;try{s=localStorage.getItem("${THEME_STORAGE_KEY}")}catch{}let d=s==="dark";if(s!=="dark"&&s!=="light"){try{d=window.matchMedia("(prefers-color-scheme: dark)").matches}catch{d=false}}const r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light"})()`;
