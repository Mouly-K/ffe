import { createContext, useContext, useEffect, useState } from "react";

import { CURRENCY } from "@/interfaces/currency";
import { THEMES, type Settings } from "@/interfaces/settings";

interface SettingsProviderProps {
  children: React.ReactNode;
  defaultSettings?: Settings;
  storageKey?: string;
}

type SettingsProviderState = {
  settings: Settings;
  setSettings: (callback: (oldSettings: Settings) => Settings) => void;
};

const initialState: SettingsProviderState = {
  settings: {
    theme: "system",
    currency: CURRENCY.CNY,
  },
  setSettings: () => null,
};

const SettingsProviderContext =
  createContext<SettingsProviderState>(initialState);

export function SettingsProvider({
  children,
  defaultSettings = initialState.settings,
  storageKey = "vite-ui-settings",
  ...props
}: SettingsProviderProps) {
  const [settings, setSettings] = useState<Settings>(
    () =>
      (JSON.parse(localStorage.getItem(storageKey) || "{}") as Settings) ||
      defaultSettings
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove(THEMES.LIGHT, THEMES.DARK);

    if (settings.theme === THEMES.SYSTEM) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? THEMES.DARK
        : THEMES.LIGHT;

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(settings.theme);
  }, [settings.theme]);

  const value = {
    settings,
    setSettings: (callback: (oldSettings: Settings) => Settings) => {
      const newSettings = callback(settings);
      localStorage.setItem(storageKey, JSON.stringify(newSettings));
      setSettings(newSettings);
    },
  };

  return (
    <SettingsProviderContext.Provider {...props} value={value}>
      {children}
    </SettingsProviderContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsProviderContext);

  if (context === undefined)
    throw new Error("useSettings must be used within a SettingsProvider");

  return context;
};
