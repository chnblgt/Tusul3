import { useState, useEffect } from "react";

export function useDarkMode() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const isDark = saved === "dark";
    setDark(isDark);
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, []);

  function toggle() {
    setDark(prev => {
      const next = !prev;
      localStorage.setItem("theme", next ? "dark" : "light");
      document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
      return next;
    });
  }

  return { dark, toggle };
}