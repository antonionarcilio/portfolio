'use client';
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'day' | 'sunset';

export type { Theme };

const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void; selectTheme: (theme: Theme) => void }>({
  theme: 'day',
  toggleTheme: () => {},
  selectTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('day');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('pro-theme') as Theme | null;
      if (saved === 'day' || saved === 'sunset') setTheme(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const selectTheme = (next: Theme) => {
    setTheme(next);
    try {
      localStorage.setItem('pro-theme', next);
    } catch {}
  };

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'day' ? 'sunset' : 'day';
      try {
        localStorage.setItem('pro-theme', next);
      } catch {}
      return next;
    });
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme, selectTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
