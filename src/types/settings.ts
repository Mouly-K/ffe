import type { Currency } from "./currency";

const THEMES = {
  DARK: "dark",
  LIGHT: "light",
  SYSTEM: "system",
} as const;

type Theme = (typeof THEMES)[keyof typeof THEMES];

interface Settings {
  theme: Theme;
  currency: Currency;
}

export { THEMES };
export type { Theme, Settings };
