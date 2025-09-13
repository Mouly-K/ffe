"use client";

import { useCallback, useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { IconColorFilter } from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { useSettings } from "./settings-provider";
import type { Theme } from "@/interfaces/settings";

const themes = [
  {
    key: "system",
    icon: Monitor,
    label: "System theme",
  },
  {
    key: "light",
    icon: Sun,
    label: "Light theme",
  },
  {
    key: "dark",
    icon: Moon,
    label: "Dark theme",
  },
] as const;

export const ThemeSwitcher = () => {
  const { settings, setSettings } = useSettings();
  const [mounted, setMounted] = useState(false);
  const handleThemeClick = useCallback(
    (newTheme: Theme) => {
      setSettings((settings) => ({ ...settings, theme: newTheme }));
    },
    [setSettings]
  );
  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }
  return (
    <div className="flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden h-8 text-sm">
      <div className="flex items-center gap-2 w-full">
        <IconColorFilter className="size-4 shrink-0" />
        {themes.find((t) => t.key === settings.theme)?.label}
      </div>
      <div
        className={cn(
          "relative isolate flex h-8 rounded-full bg-background p-1 ring-1 ring-border"
        )}
      >
        {themes.map(({ key, icon: Icon, label }) => {
          const isActive = settings.theme === key;
          return (
            <button
              aria-label={label}
              className="relative h-6 w-6 rounded-full"
              key={key}
              onClick={() => handleThemeClick(key)}
              type="button"
            >
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-secondary"
                  layoutId="activeTheme"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
              <Icon
                className={cn(
                  "relative z-10 m-auto h-4 w-4",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
