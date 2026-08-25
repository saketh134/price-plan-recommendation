import { useEffect, useState } from "react";

function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("tariffsmart-theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("tariffsmart-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("tariffsmart-theme", "light");
    }
  }, [darkMode]);

  return (
    <button
      type="button"
      onClick={() => setDarkMode(!darkMode)}
      className="theme-toggle"
    >
      {darkMode ? "☀️ Bright Mode" : "🌙 Dark Mode"}
    </button>
  );
}

export default ThemeToggle;