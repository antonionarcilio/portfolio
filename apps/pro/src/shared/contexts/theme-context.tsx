'use client';
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'day' | 'sunset';

const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void }>({
  theme: 'day',
  toggleTheme: () => {},
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

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'day' ? 'sunset' : 'day';
      try {
        localStorage.setItem('pro-theme', next);
      } catch {}
      return next;
    });
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
