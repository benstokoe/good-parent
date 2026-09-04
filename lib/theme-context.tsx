import { useColorScheme as useNativeWindColorScheme } from "nativewind";
import { createContext, useContext, useEffect, useMemo } from "react";
import { useColorScheme } from "react-native";

import { useAppData } from "@/lib/app-data";
import { darkSemantic, lightSemantic, type Semantic } from "@/lib/theme";

type ColorScheme = "light" | "dark";

const SemanticContext = createContext<Semantic>(lightSemantic);
const ColorSchemeContext = createContext<ColorScheme>("light");

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { state } = useAppData();
  const systemScheme = useColorScheme();
  const preference = state.settings.themePreference;

  const scheme: ColorScheme =
    preference === "system" ? (systemScheme === "dark" ? "dark" : "light") : preference;

  const value = useMemo(() => (scheme === "dark" ? darkSemantic : lightSemantic), [scheme]);

  // Drives NativeWind's `dark:` class variant (used by the React Native Reusables
  // components, which are styled purely with Tailwind classes) so it follows the same
  // preference — system/light/dark — as our own semantic-token context above, instead
  // of only ever tracking the OS setting.
  const { setColorScheme } = useNativeWindColorScheme();
  useEffect(() => {
    setColorScheme(preference);
  }, [preference, setColorScheme]);

  return (
    <ColorSchemeContext.Provider value={scheme}>
      <SemanticContext.Provider value={value}>{children}</SemanticContext.Provider>
    </ColorSchemeContext.Provider>
  );
}

// Reactive replacement for importing `semantic` directly — call inside a component so
// its colors follow the active theme (system preference or the user's explicit override).
export function useSemantic() {
  return useContext(SemanticContext);
}

export function useColorSchemeValue() {
  return useContext(ColorSchemeContext);
}
