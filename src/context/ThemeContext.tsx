import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type Theme = "dark" | "light";

interface ThemeCtx {
  theme: Theme;
  toggle: () => void;
  isDark: boolean;
  c: {
    bg: string; bg2: string; bg3: string;
    text: string; textMuted: string;
    border: string; borderHover: string;
    card: string; navBg: string;
    inputBg: string;
  };
}

const ThemeContext = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() =>
    (localStorage.getItem("newran_theme") as Theme) || "dark"
  );

  useEffect(() => {
    localStorage.setItem("newran_theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  const isDark = theme === "dark";

  
  const c: ThemeCtx["c"] = isDark
    ? {
        bg:          "#0a0a0f",
        bg2:         "#0e0c18",
        bg3:         "#13111f",
        text:        "#f0ece0",
        textMuted:   "#6a6258",
        border:      "rgba(201,168,76,0.15)",
        borderHover: "rgba(201,168,76,0.4)",
        card:        "rgba(16,14,26,0.85)",
        navBg:       "rgba(8,7,14,0.9)",
        inputBg:     "rgba(255,255,255,0.04)",
      }
    : {
        bg:          "#f5f0e8",
        bg2:         "#ede8dc",
        bg3:         "#e4ddd0",
        text:        "#1a1610",
        textMuted:   "#7a6e5f",
        border:      "rgba(139,105,20,0.2)",
        borderHover: "rgba(139,105,20,0.5)",
        card:        "rgba(255,252,245,0.95)",
        navBg:       "rgba(245,240,232,0.92)",
        inputBg:     "rgba(0,0,0,0.04)",
      };

  return (
    <ThemeContext.Provider value={{ theme, toggle, isDark, c }}>
      <div style={{ background: c.bg, minHeight: "100vh", transition: "background 0.4s ease" }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be inside ThemeProvider");
  return ctx;
}