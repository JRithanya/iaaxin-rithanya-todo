import React, { createContext, useState, useEffect, useContext } from "react";

// Create the context
const ThemeContext = createContext();

// Provider component
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const stored = localStorage.getItem("enhanced-todo-theme");
      return stored ? JSON.parse(stored) : true;
    } catch (err) {
      console.error("Failed to load theme:", err);
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("enhanced-todo-theme", JSON.stringify(isDarkMode));
      document.documentElement.classList.toggle("dark", isDarkMode);
    } catch (err) {
      console.error("Failed to save theme:", err);
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Export only the hook here to avoid mixing
export const useTheme = () => useContext(ThemeContext);
