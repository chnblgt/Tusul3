import { useState, useEffect } from "react";

const MODES = ["light", "dark", "purple"];

export function useTheme() {
  const [mode, setMode] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    const valid = MODES.includes(saved) ? saved : "light";
    setMode(valid);
    document.documentElement.setAttribute("data-theme", valid);
  }, []);

  function cycle() {
    setMode(prev => {
      const next = MODES[(MODES.indexOf(prev) + 1) % MODES.length];
      localStorage.setItem("theme", next);
      document.documentElement.setAttribute("data-theme", next);
      return next;
    });
  }

  const dark = mode === "dark" || mode === "purple";
  const toggle = cycle;

  return { mode, cycle, dark, toggle };
}

export function useDarkMode() {
  return useTheme();
}