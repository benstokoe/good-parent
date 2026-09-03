import { Platform, useWindowDimensions } from "react-native";

// The web-only breakpoint where the app switches from the mobile single-column stack to
// the desktop sidebar + detail-pane shell (DESIGN.md "Layout" / docs/adr/0005). Gated by
// viewport width per CLAUDE.md (not a per-OS Platform.OS branch) — narrow browser windows
// and mobile web fall back to the same single-column layout native ships.
export const WEB_SHELL_BREAKPOINT = 900;

export function useIsWideWeb() {
  const { width } = useWindowDimensions();
  return Platform.OS === "web" && width >= WEB_SHELL_BREAKPOINT;
}
