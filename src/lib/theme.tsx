"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "jeet-theme";

/**
 * Reads the theme already applied to <html> by the blocking script in
 * layout.tsx (see FOUC-prevention script). This runs after hydration,
 * so client and server agree on "light" for the very first paint, then
 * this syncs React state to whatever the script actually set — avoids
 * a hydration mismatch while still killing the flash-of-wrong-theme.
 */
function readAppliedTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    setThemeState(readAppliedTheme());
  }, []);

  const applyTheme = useCallback((t: Theme) => {
    setThemeState(t);
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem(STORAGE_KEY, t); } catch { /* ignore */ }
  }, []);

  const toggle = useCallback(() => {
    applyTheme(theme === "dark" ? "light" : "dark");
  }, [theme, applyTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme: applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    /* Safe fallback for any component rendered outside the provider
       (shouldn't happen once it's in layout.tsx, but keeps this hook
       from crashing the app if it ever is). */
    return { theme: "light", toggle: () => {}, setTheme: () => {} };
  }
  return ctx;
}

/**
 * Inline script string, injected once in layout.tsx <head>.
 * Runs synchronously before React hydrates, so the correct theme is
 * already on <html> for the very first paint — no flash of the wrong
 * theme. Always defaults to light on a first visit — deliberately does
 * NOT follow the OS's prefers-color-scheme, only an explicit prior
 * toggle (stored in localStorage) switches it to dark.
 */
export const THEME_INIT_SCRIPT = `
(function() {
  try {
    var stored = localStorage.getItem('${STORAGE_KEY}');
    var theme = stored === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();
`;
