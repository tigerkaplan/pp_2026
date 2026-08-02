import {
  applyThemeToRoot,
  parseThemeSetting,
  readStoredThemeSetting,
  resolveTheme,
  THEME_BOOTSTRAP_SCRIPT,
  THEME_STORAGE_KEY,
} from "./theme";

function runBootstrap({
  stored,
  systemDark,
  storageThrows = false,
}: {
  stored: string | null;
  systemDark: boolean;
  storageThrows?: boolean;
}) {
  const root = document.documentElement;
  root.classList.remove("dark");
  root.style.colorScheme = "";

  const execute = new Function(
    "localStorage",
    "window",
    "document",
    THEME_BOOTSTRAP_SCRIPT,
  );
  execute(
    {
      getItem: () => {
        if (storageThrows) throw new Error("blocked");
        return stored;
      },
    },
    {
      matchMedia: () => ({ matches: systemDark }),
    },
    {
      documentElement: root,
    },
  );

  return root;
}

test("parses only the existing light, dark and system settings", () => {
  expect(parseThemeSetting("dark")).toBe("dark");
  expect(parseThemeSetting("light")).toBe("light");
  expect(parseThemeSetting("system")).toBe("system");
  expect(parseThemeSetting("sepia")).toBeNull();
  expect(parseThemeSetting(null)).toBeNull();
});

test("resolves explicit preferences before the system preference", () => {
  expect(resolveTheme("dark", "light")).toBe("dark");
  expect(resolveTheme("light", "dark")).toBe("light");
  expect(resolveTheme("system", "dark")).toBe("dark");
  expect(resolveTheme(null, "light")).toBe("light");
  expect(resolveTheme(null, "dark")).toBe("light");
});

test("handles unavailable storage without inventing another setting", () => {
  expect(
    readStoredThemeSetting({
      getItem: () => {
        throw new Error("blocked");
      },
    }),
  ).toBeNull();
});

test("applies matching root class and color scheme", () => {
  applyThemeToRoot(document.documentElement, "dark");
  expect(document.documentElement).toHaveClass("dark");
  expect(document.documentElement).toHaveStyle({ colorScheme: "dark" });

  applyThemeToRoot(document.documentElement, "light");
  expect(document.documentElement).not.toHaveClass("dark");
  expect(document.documentElement).toHaveStyle({ colorScheme: "light" });
});

test("emits a synchronous head bootstrap using the same source of truth", () => {
  expect(THEME_STORAGE_KEY).toBe("theme");
  expect(THEME_BOOTSTRAP_SCRIPT).toContain(
    `localStorage.getItem("${THEME_STORAGE_KEY}")`,
  );
  expect(THEME_BOOTSTRAP_SCRIPT).toContain(
    'matchMedia("(prefers-color-scheme: dark)")',
  );
  expect(THEME_BOOTSTRAP_SCRIPT).toContain(
    'classList.toggle("dark",d)',
  );
  expect(THEME_BOOTSTRAP_SCRIPT).toContain(
    'style.colorScheme=d?"dark":"light"',
  );
  expect(THEME_BOOTSTRAP_SCRIPT).not.toContain("eval");
  expect(THEME_BOOTSTRAP_SCRIPT).not.toContain("</script");
});

test("bootstrap applies stored dark before system light", () => {
  expect(
    runBootstrap({ stored: "dark", systemDark: false }),
  ).toHaveClass("dark");
  expect(document.documentElement).toHaveStyle({ colorScheme: "dark" });
});

test("bootstrap applies stored light before system dark", () => {
  expect(
    runBootstrap({ stored: "light", systemDark: true }),
  ).not.toHaveClass("dark");
  expect(document.documentElement).toHaveStyle({ colorScheme: "light" });
});

test.each([
  { stored: null, systemDark: true, expected: "light" },
  { stored: "system", systemDark: false, expected: "light" },
  { stored: "malformed", systemDark: true, expected: "light" },
])(
  "bootstrap resolves $stored with systemDark=$systemDark as $expected",
  ({ stored, systemDark, expected }) => {
    runBootstrap({ stored, systemDark });
    expect(document.documentElement.classList.contains("dark")).toBe(
      expected === "dark",
    );
    expect(document.documentElement).toHaveStyle({ colorScheme: expected });
  },
);

test("bootstrap safely falls back to light when storage throws", () => {
  runBootstrap({ stored: null, systemDark: true, storageThrows: true });
  expect(document.documentElement).not.toHaveClass("dark");
  expect(document.documentElement).toHaveStyle({ colorScheme: "light" });
});
