"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

interface ThemeToggleProps {
  readonly variant?: "default" | "outline" | "ghost";
  readonly size?: "default" | "sm" | "lg";
  readonly showLabel?: boolean;
}

export function ThemeToggle({
  variant = "ghost",
  size = "sm",
  showLabel = false,
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant={variant} size={size} className="w-9 h-9">
        <div className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
        if (!document.startViewTransition) {
          setTheme(theme === "light" ? "dark" : "light");
          return;
        }

        const x = event.clientX;
        const y = event.clientY;
        const endRadius = Math.hypot(
          Math.max(x, window.innerWidth - x),
          Math.max(y, window.innerHeight - y)
        );

        document.startViewTransition(() => {
          const root = document.documentElement;
          root.style.setProperty("--x", `${x}px`);
          root.style.setProperty("--y", `${y}px`);
          root.style.setProperty("--r", `${endRadius}px`);
          setTheme(theme === "light" ? "dark" : "light");
        });
      }}
      className={`transition-all duration-200 ${
        showLabel ? "gap-2" : "w-9 h-9"
      }`}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      {showLabel && (
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          {theme === "light" ? "Dark" : "Light"} Mode
        </span>
      )}
    </Button>
  );
}
