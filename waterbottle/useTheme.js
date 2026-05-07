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
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const safe = MODES.includes(current) ? current : "light";
    const next = MODES[(MODES.indexOf(safe) + 1) % MODES.length];
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
    setMode(next);
  }

  function setTheme(t) {
    if (!MODES.includes(t)) return;
    localStorage.setItem("theme", t);
    document.documentElement.setAttribute("data-theme", t);
    setMode(t);
  }

  const dark = mode === "dark" || mode === "purple";
  const toggle = cycle;

  return { mode, cycle, dark, toggle, setTheme };
}

export function useDarkMode() {
  return useTheme();
}