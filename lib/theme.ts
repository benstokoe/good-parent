// Design tokens ported verbatim from the Clay design system (colors.css / spacing.css /
// typography.css) — see DESIGN.md and docs/adr/0006. This module exists alongside the
// NativeWind/Tailwind config for the places a className can't reach (icon `color` props,
// gradients, the status bar). Keep both in sync if a token value ever changes.

export const colors = {
  warm: {
    0: "#FFFFFF",
    50: "#FAF9F5",
    100: "#F0EEE6",
    150: "#EAE7DC",
    200: "#E5E4DF",
    300: "#CFCDC4",
    400: "#A8A69C",
    500: "#82807A",
    600: "#5C5A54",
    700: "#40403E",
    800: "#262625",
    900: "#191918",
  },
  clay: {
    50: "#FBF0EB",
    100: "#F5DDD2",
    200: "#E9B79E",
    300: "#DE9877",
    400: "#D97757",
    500: "#C4623F",
    600: "#A34A2C",
    700: "#7D3720",
  },
  kraft: "#D4A27F",
  kraftTint: "#F3E4D6",
  manilla: "#EBDBBC",
  manillaTint: "#F7EFDF",
  sky: "#6C8FB8",
  skyTint: "#E2EAF2",
  moss: "#7A8B5C",
  mossTint: "#E9EDE1",
  green: "#4E7C59",
  greenTint: "#E6EEE7",
  amber: "#B5822B",
  amberTint: "#F7EBD5",
  red: "#B4453A",
  redTint: "#F8E4E1",
  blue: "#4E6E9E",
  blueTint: "#E4EAF3",
} as const;

export const lightSemantic = {
  surfacePage: colors.warm[50],
  surfaceSunken: colors.warm[100],
  surfaceCard: colors.warm[0],
  surfaceRaised: colors.warm[0],
  surfaceInverse: colors.warm[900],
  surfaceAccent: colors.clay[50],
  surfaceHover: colors.warm[100],
  surfaceActive: colors.warm[150],
  surfaceDisabled: colors.warm[100],

  textHeading: colors.warm[900],
  textBody: colors.warm[800],
  textMuted: colors.warm[600],
  textSubtle: colors.warm[500],
  textInverse: colors.warm[50],
  textAccent: colors.clay[600],
  textLink: colors.clay[600],
  textDisabled: colors.warm[400],

  borderSubtle: colors.warm[200],
  borderDefault: colors.warm[300],
  borderStrong: colors.warm[400],
  borderAccent: colors.clay[400],
  borderInverse: colors.warm[700],

  actionPrimary: colors.clay[400],
  actionPrimaryHover: colors.clay[500],
  actionPrimaryActive: colors.clay[600],
  actionSecondary: colors.warm[0],
  actionInverse: colors.warm[900],

  focusRing: colors.clay[400],
  focusRingHalo: "rgba(217,119,87,.28)",
} as const;

// Same structure as light, paper→near-black and ink→warm off-white — see DESIGN.md's
// dark mode note — not an inverted afterthought with new roles.
export const darkSemantic = {
  surfacePage: colors.warm[900],
  surfaceSunken: colors.warm[800],
  surfaceCard: colors.warm[700],
  surfaceRaised: colors.warm[700],
  surfaceInverse: colors.warm[50],
  surfaceAccent: "rgba(217,119,87,0.16)",
  surfaceHover: colors.warm[700],
  surfaceActive: colors.warm[600],
  surfaceDisabled: colors.warm[800],

  textHeading: colors.warm[50],
  textBody: colors.warm[100],
  textMuted: colors.warm[400],
  textSubtle: colors.warm[500],
  textInverse: colors.warm[900],
  textAccent: colors.clay[200],
  textLink: colors.clay[200],
  textDisabled: colors.warm[600],

  borderSubtle: colors.warm[700],
  borderDefault: colors.warm[600],
  borderStrong: colors.warm[500],
  borderAccent: colors.clay[400],
  borderInverse: colors.warm[200],

  actionPrimary: colors.clay[400],
  actionPrimaryHover: colors.clay[300],
  actionPrimaryActive: colors.clay[200],
  actionSecondary: colors.warm[700],
  actionInverse: colors.warm[50],

  focusRing: colors.clay[300],
  focusRingHalo: "rgba(217,119,87,.35)",
} as const;

export type Semantic = { [K in keyof typeof lightSemantic]: string };

// Kept as the default export for any call site that hasn't migrated to useSemantic()
// yet (e.g. a value needed outside a component). Prefer useSemantic() in components
// so colors react to the active theme.
export const semantic = lightSemantic;

export const spacing = {
  0: 0,
  1: 2,
  2: 4,
  3: 6,
  4: 8,
  5: 12,
  6: 16,
  7: 20,
  8: 24,
  9: 32,
  10: 40,
  11: 48,
  12: 64,
  13: 80,
  14: 96,
} as const;

export const radius = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 24,
  pill: 999,
} as const;

// Font families registered via expo-font in app/_layout.tsx's useFonts() call — keep in
// sync with that list.
export const fontFamily = {
  displayRegular: "Fraunces_400Regular",
  displaySemibold: "Fraunces_600SemiBold",
  displayBold: "Fraunces_700Bold",
  bodyRegular: "Inter_400Regular",
  bodyMedium: "Inter_500Medium",
  bodySemibold: "Inter_600SemiBold",
  bodyBold: "Inter_700Bold",
} as const;

// DESIGN.md's named type scale. The Serif-Is-A-Moment Rule: Fraunces only at Title size
// and above — everything Body-sized or smaller stays Inter.
export const typography = {
  displayXL: { fontFamily: fontFamily.displaySemibold, fontSize: 64, lineHeight: 70 },
  displayLG: { fontFamily: fontFamily.displaySemibold, fontSize: 48, lineHeight: 54 },
  displayMD: { fontFamily: fontFamily.displaySemibold, fontSize: 38, lineHeight: 44 },
  titleLG: { fontFamily: fontFamily.displaySemibold, fontSize: 30, lineHeight: 36 },
  titleMD: { fontFamily: fontFamily.displaySemibold, fontSize: 24, lineHeight: 30 },
  titleSM: { fontFamily: fontFamily.displaySemibold, fontSize: 20, lineHeight: 26 },
  bodyLG: { fontFamily: fontFamily.bodyRegular, fontSize: 17, lineHeight: 24 },
  bodyMD: { fontFamily: fontFamily.bodyRegular, fontSize: 15, lineHeight: 22 },
  bodySM: { fontFamily: fontFamily.bodyRegular, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: fontFamily.bodyRegular, fontSize: 12, lineHeight: 16 },
  ui: { fontFamily: fontFamily.bodyMedium, fontSize: 13, lineHeight: 18 },
} as const;

// DESIGN.md's Warm Shadow Rule: every shadow is black at low opacity, never tinted —
// depth stays quiet even though the rest of the system is warm. React Native has no
// single cross-platform shadow prop, so each token carries both the iOS shadow* props
// and the Android `elevation` fallback.
export const shadows = {
  xs: {
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  sm: {
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 9 },
    elevation: 9,
  },
  overlay: {
    shadowColor: "#000",
    shadowOpacity: 0.28,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 12 },
    elevation: 16,
  },
} as const;
