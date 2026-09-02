---
name: GoodParent
description: A warm, quiet, paper-and-ink system for a private app that reflects a parent's own good moments back at them.
colors:
  background: "#FAF9F5"
  surface: "#E9E8E4"
  surfaceSunken: "#F0EEE6"
  textPrimary: "#141413"
  textSecondary: "#686865"
  textSubtle: "#82807A"
  border: "#C7C6C3"
  accent: "#D97757"
  accentHover: "#C4623F"
  accentBlue: "#6A9BCC"
  accentGreen: "#788C5D"
  gray100: "#E9E8E4"
  gray200: "#C7C6C3"
  gray300: "#A6A5A2"
  gray400: "#868683"
  gray500: "#686865"
  gray600: "#4B4B49"
  gray700: "#30302E"
  gray800: "#111111"
  gray900: "#020202"
  gray950: "#000000"
  statusSuccess: "#4E7C59"
  statusSuccessSurface: "#E6EEE7"
  statusWarning: "#B5822B"
  statusWarningSurface: "#F7EBD5"
  statusDanger: "#B4453A"
  statusDangerSurface: "#F8E4E1"
  statusInfo: "#4E6E9E"
  statusInfoSurface: "#E4EAF3"
typography:
  displayXL:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "64px"
    fontWeight: 600
  displayLG:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "48px"
    fontWeight: 600
  displayMD:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "38px"
    fontWeight: 600
  titleLG:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "30px"
    fontWeight: 600
  titleMD:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "24px"
    fontWeight: 600
  titleSM:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "20px"
    fontWeight: 600
  bodyLG:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: "17px"
    fontWeight: 400
  bodyMD:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: "15px"
    fontWeight: 400
  bodySM:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: "13px"
    fontWeight: 400
  caption:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: "12px"
    fontWeight: 400
  ui:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: "13px"
    fontWeight: 500
rounded:
  xs: "4px"
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  xxl: "24px"
  pill: "9999px"
spacing:
  s0: "0px"
  s1: "2px"
  s2: "4px"
  s3: "6px"
  s4: "8px"
  s5: "12px"
  s6: "16px"
  s7: "20px"
  s8: "24px"
  s9: "32px"
  s10: "40px"
  s11: "48px"
  s12: "64px"
  s13: "80px"
  s14: "96px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#FFFFFF"
    rounded: "{rounded.pill}"
    padding: "8px 12px"
  button-primary-hover:
    backgroundColor: "{colors.accentHover}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.textPrimary}"
    rounded: "{rounded.pill}"
    padding: "4px 8px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.textPrimary}"
    rounded: "{rounded.lg}"
    padding: "12px"
  input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.textPrimary}"
    rounded: "{rounded.md}"
---

# Design System: GoodParent (Expo port)

This is the same design system as the SwiftUI version of GoodParent (`../GoodParent/DESIGN.md`) — the tokens above and the rules below are ported verbatim, since visual identity doesn't change with platform. Only the implementation notes (how a rule is enforced in code) differ; the values and reasoning do not. See `docs/adr/0001-adopt-anthropic-palette.md` and `docs/adr/0002-bundle-fraunces-inter-fonts.md` for why this palette/type pairing was chosen deliberately.

## Overview

**Creative North Star: "A quiet paper record"**

GoodParent's system is warm, matte, and unhurried — closer to a well-kept paper notebook than a productivity app. The palette is the exact Anthropic/Claude brand palette (background `#FAF9F5`, ink `#141413`, clay accent `#D97757`), adopted deliberately for a stronger identity rather than tuned as inspiration (see `docs/adr/0001`); Fraunces (serif display) and Inter (sans body) were bundled specifically to sit closer to Anthropic's own Styrene/Tiempos pairing than free system fonts would (`docs/adr/0002`). Treat the palette and type pairing below as the confirmed, permanent identity, not a placeholder.

Surfaces stay flat and warm rather than glossy: no glass, no saturated gradients, no neutral-grey chrome. Elevation reads through very soft, warm-tinted shadows and tonal surface steps (background → surface → surfaceSunken), never a stark drop shadow. One accent color (clay) carries every primary action and highlight; blue and green exist only as small semantic/secondary accents (child milestones, secondary tags), never as competing brand colors.

**Key Characteristics:**
- Warm off-white paper ground, near-black ink text — never pure white or pure black.
- Serif display (Fraunces) for headings and moments of warmth; sans (Inter) carries every UI and body context.
- One accent (clay) does the work; blue/green are semantic accents, not alternate brand colors.
- Flat surfaces, soft warm shadows, generous rounding — nothing sharp-cornered or glossy.
- Full dark mode with the same structure (paper→near-black, ink→warm off-white), not an inverted afterthought.

## Colors

Warm, low-saturation neutrals carry almost the whole interface; the single clay accent is reserved for primary actions and one-per-screen emphasis.

### Primary
- **Clay** (`#D97757` / `accent`): every primary button, active tab, and "this matters now" highlight. Hover/pressed state is **Clay Deep** (`#C4623F` / `accentHover`).

### Secondary (semantic, not alternate brand colors)
- **Secondary Blue** (`#6A9BCC` / `accentBlue`): Child Milestone label color only.
- **Secondary Green** (`#788C5D` / `accentGreen`): Parent Milestone label color only.

### Neutral
- **Warm Paper** (`#FAF9F5` / `background`): the base ground for every screen.
- **Warm Fog** (`#E9E8E4` / `surface`): default card and control background.
- **Warm Fog Sunken** (`#F0EEE6` / `surfaceSunken`): recessed surfaces — pill-tab tracks, the sunken recap card, private-mode chip.
- **Ink** (`#141413` / `textPrimary`): primary text.
- **Ink Secondary** (`#686865` / `textSecondary`): supporting text, timestamps, subtitles.
- **Ink Subtle** (`#82807A` / `textSubtle`): captions, section labels, least-important text.
- **Hairline** (`#C7C6C3` / `border`): the only stroke color; 1px, always.
- A full **Gray100–Gray950** ramp (`#E9E8E4` → `#000000`) backs the neutrals above and both light/dark appearances; don't reach for a new gray outside this ramp.

### Status
- **Success** `#4E7C59` on surface `#E6EEE7`, **Warning** `#B5822B` on `#F7EBD5`, **Danger** `#B4453A` on `#F8E4E1`, **Info** `#4E6E9E` on `#E4EAF3` — each a muted, warm-shifted tone next to its own pale surface tint, not a saturated system red/green/blue.

### Named Rules
**The One Accent Rule.** Clay is the only color that means "act on this." Status colors mean state, Blue/Green mean milestone type — none of them substitute for the primary accent.

**The Named-Token, Not Raw-Hex Rule.** Every color should ship as a named token from a single theme source (e.g. a `theme.ts`/`colors.ts` module, or a NativeWind/Tamagui token set), each with its own light and dark value, so the whole palette adapts to the OS color scheme (`useColorScheme()`) automatically. New UI never hard-codes a hex value inline.

## Typography

**Display Font:** Fraunces (variable, serif)
**Body/UI Font:** Inter (variable, sans)

**Character:** A warm literary serif for headings against a clean, quiet sans for everything you actually read and act on — the display face signals "this is a moment," the body face gets out of the way.

Both are open-source Google Fonts and load via `expo-font`/`@expo-google-fonts/fraunces` + `@expo-google-fonts/inter` (or bundled `.ttf` assets) rather than any native-only font API.

### Hierarchy
- **Display** (Fraunces, semibold 600, 38–64px): greetings and top-of-screen headlines only (`displayMD/LG/XL`).
- **Title** (Fraunces, semibold 600, 20–30px): card and section headings (`titleSM/MD/LG`).
- **Body** (Inter, regular 400, 13–17px): all reading content (`bodySM/MD/LG`).
- **UI** (Inter, medium 500, 13px): buttons, tabs, labels that are acted on rather than read.
- **Caption** (Inter, regular 400, 12px): timestamps, metadata, least-emphasized text.

### Named Rules
**The Serif-Is-A-Moment Rule.** Fraunces appears only at Title size and above. Anything at Body size or smaller is always Inter — a serif body would read as a scanned document, not a UI.

## Layout

**Mobile (iOS/Android):** Single-column, generously padded content (`s6`/16px screen margins, `s5`/12px–`s6`/16px between stacked elements). No grid system — every screen is a vertical stack of full-width cards and rows. A bottom tab bar is the navigation chrome.

**Web:** As of `docs/adr/0005` (Convex + Clerk make accounts portable across devices), web is a first-class target and gets its own wider layout — a sidebar + detail-pane structure, not a scaled-up version of the mobile stack. This is a considered exception to the single-column rule above, not a contradiction of it: mobile keeps the rules in this document unchanged; web's structure echoes the *intent* of the SwiftUI version's macOS `NavigationSplitView` (sidebar nav, wide-viewport-appropriate density) without porting it literally — re-derive it idiomatically for Expo web, the same way `CLAUDE.md` asks for any other cross-platform behavior. The color/type/spacing/elevation tokens on this page apply identically on web; only the page-level composition (single stack vs. sidebar+detail) differs by platform.

## Elevation & Depth

Mostly flat, with elevation conveyed by tonal surface steps first (`background` → `surface` → `surfaceSunken`) and a warm, never-neutral-black shadow only on floating cards. Shadows are soft and low-opacity even at their largest — this system never uses a hard or dark drop shadow. In React Native, express these via `shadow*`/`elevation` style props (or a cross-platform shadow library) matching the values below.

### Shadow Vocabulary
- **xs** (`0 1px 1px rgba(0,0,0,0.04)`): the default on every card.
- **sm** (`0 1px 2px rgba(0,0,0,0.06)`): minor raised elements.
- **md** (`0 3px 8px rgba(0,0,0,0.10)`): rarely used; a card that needs to read as clearly above the page.
- **lg** (`0 9px 20px rgba(0,0,0,0.16)`) / **overlay** (`0 12px 32px rgba(0,0,0,0.28)`): sheets and modals only.

### Named Rules
**The Warm Shadow Rule.** Every shadow is black at low opacity, never tinted or colored — depth stays quiet and neutral even though everything else is warm.

## Shapes

Two radius families cover the whole app: **pill/capsule** (buttons, tabs, badges, tags — anything you tap) and **rounded rectangle at `lg`/12px** (cards) or **`md`/8px** (bordered inputs and text fields). Avatars, icon circles, and the tab-bar's raised center button are true circles. Borders are always 1px `Hairline` (`#C7C6C3`), used only on inputs, tags, and outlined chips — never on filled cards, which rely on the tonal surface step instead of a stroke.

## Components

### Buttons
- **Shape:** Capsule (pill), always — no rectangular buttons anywhere in the app.
- **Primary:** Clay background, white text, `s4`/8px–`s5`/12px vertical padding at small size or full-width at `s4`/8px vertical padding; `accentHover` (Clay Deep) on press.
- **Secondary:** `surface` background, `textPrimary` text, 1px Hairline border, no fill.
- **Pressed state:** every button style dims to 70% opacity rather than changing shape or shadow (in RN, drive this via `Pressable`'s `style={({pressed}) => ...}` opacity, not a separate shadow/shape change).

### Cards
- **Corner Style:** `lg`/12px radius, always.
- **Background:** `default` tone = `surface`; `sunken` tone = `surfaceSunken` (recap teaser, recessed content); `accent` tone = `Gray100` (a pale clay-adjacent tint, not the accent color itself).
- **Shadow:** `xs` only — cards sit barely above the page, never dramatically elevated.
- **Border:** none; the tonal background does the separating.
- **Internal Padding:** `md`/12px by default; `sm`/8px or `lg`/20px for denser or looser content.

### Inputs / Fields
- **Style:** `background` fill, 1px Hairline border, `md`/8px radius — the one place a border and a fill coexist.
- **Focus / Selected:** the border switches from Hairline to Clay; no glow or shadow change.

### Badges & Tags
- **Badge:** pill-shaped, colored text on its own pale status-tint surface (e.g. Danger text on Danger Surface), optional leading dot.
- **Tag:** pill-shaped, `surface` + Hairline border when unselected, filled Clay + white text when selected — no in-between state.

### Navigation
- **iOS & Android:** a custom bottom tab bar (Home / Journal / Growth Space / Timeline) with a raised, circular center Panic Button as a true tab-bar item rather than a floating overlay (e.g. via `@react-navigation/bottom-tabs` with a custom tab bar renderer).
- **Section labels:** small, uppercase, `textSubtle`, `0.6pt` tracking — the only place letter-spacing is used.

## Do's and Don'ts

### Do:
- **Do** use the named theme tokens for everything — they carry the correct dark-mode value automatically.
- **Do** keep Fraunces to Title size and above; Inter handles everything smaller.
- **Do** make every tappable control a capsule; every card `lg`/12px rounded; every bordered input `md`/8px rounded.
- **Do** let Clay stay the only "act now" color — blue and green are milestone-type labels, not alternate CTAs.
- **Do** keep shadows warm-black and soft (`xs` on ordinary cards); reserve `lg`/`overlay` for sheets and modals only.

### Don't:
- **Don't** introduce a second brand accent color alongside Clay — status and secondary colors are semantic, not decorative alternates.
- **Don't** use a rectangular or square-cornered button anywhere; capsule is the only button shape in this system.
- **Don't** put a border on a filled card — cards separate from the page via tone (surface vs. surfaceSunken), not a stroke.
- **Don't** hardcode a hex color in new component code — every color exists as a named, dark-mode-aware token already.
