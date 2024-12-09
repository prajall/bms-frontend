import { useEffect, useState } from "react";
type Theme = {
  background?: string;
  foreground?: string;
  primary: string;
  "primary-foreground"?: string;
  secondary: string;
  "secondary-foreground"?: string;
  dark?: string;
};

export const availableThemes: Record<string, Theme> = {
  blue: {
    background: "0 0% 100%",
    foreground: "240 10% 3.9%",
    primary: "217 89% 61%",
    "primary-foreground": "0 0% 98%",
    secondary: "217 89% 61%",
    "secondary-foreground": "240 5.9% 10%",
  },
  "blue-dark": {
    background: "20 14.3% 4.1%",
    foreground: "0 0% 95%",
    primary: "217 89% 61%",
    "primary-foreground": "0 0% 98%",
    secondary: "217 89% 74%",
    "secondary-foreground": "240 5.9% 10%",
  },
  green: {
    background: "0 0% 100%",
    foreground: "240 10% 3.9%",
    primary: "151, 87%, 37%",
    "primary-foreground": "0 0% 98%",
    secondary: "151 87% 50%",
    "secondary-foreground": "240 5.9% 10%",
  },
  "green-dark": {
    background: "20 14.3% 4.1%",
    foreground: "0 0% 95%",
    primary: "151, 87%, 37%",
    "primary-foreground": "0 0% 98%",
    secondary: "151, 87%, 50%",
    "secondary-foreground": "0 0% 98%",
  },
};

export const useTheme = () => {
  const [theme, setThemeState] = useState<string>(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      return savedTheme;
    }

    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    return prefersDarkMode ? "green-dark" : "green";
  });

  useEffect(() => {
    if (availableThemes[theme]) {
      const selectedTheme = availableThemes[theme];

      Object.entries(selectedTheme).forEach(([key, value]) => {
        console.log(key, value);
        document.documentElement.style.setProperty(`--${key}`, value);
      });

      if (theme.endsWith("-dark")) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      localStorage.setItem("theme", theme);
    } else {
      console.warn(`Theme "${theme}" is not available.`);
    }
  }, [theme]);

  const setThemeColour = (newTheme: string) => {
    const cleanTheme = newTheme.replace("-dark", "");
    const isDark = theme.includes("dark");
    const combinedTheme = isDark ? `${cleanTheme}-dark` : cleanTheme;
    if (availableThemes[combinedTheme]) {
      setThemeState(combinedTheme);
    } else {
      console.warn(`Theme "${newTheme}" is not available.`);
    }
  };

  const setTheme = (isDarkMode: boolean) => {
    const cleanTheme = theme.replace("-dark", "");
    const combinedTheme = isDarkMode ? `${cleanTheme}-dark` : cleanTheme;
    if (availableThemes[combinedTheme]) {
      setThemeState(combinedTheme);
    }
  };

  return { theme, setThemeColour, setTheme };
};
