
import React, { createContext, useContext } from 'react';

// We'll use a simplified version that just provides a fixed theme
interface ThemeContextType {
  theme: 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Always use dark theme now
  const theme = 'dark';

  // Apply dark theme to document root
  const root = window.document.documentElement;
  if (!root.classList.contains('dark')) {
    root.classList.add('dark');
  }

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
