# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

GoodParent — an Expo (React Native) port of the SwiftUI/SwiftData GoodParent app, targeting iOS, Android, and web from one codebase (see the sibling `../GoodParent` project for the original; see `docs/adr/0005` for why web was added as a first-class target here). A single-tenant-per-account app that helps a parent recognize and hold on to evidence that they *are* a good parent — see `CONTEXT.md` for the domain glossary, which is shared verbatim with the SwiftUI version since the product concept doesn't change across platforms.

## Status

Scaffolded with `create-expo-app` on Expo SDK 54 (Expo Router, TypeScript), plus the ported context/design docs (`CONTEXT.md`, `PRODUCT.md`, `DESIGN.md`, `docs/adr/`). The app itself is still minimal (default Expo Router starter) — screens, the Convex schema, and Clerk auth are not yet built.

## Build & test

```bash
# Start the dev server (scan the QR code with Expo Go on SDK 54)
npx expo start

# Run on iOS simulator / Android emulator
npx expo run:ios
npx expo run:android

# Run web
npx expo start --web

# Type check
npx tsc --noEmit

# Tests (once a test runner is added — Jest is the Expo default)
npx jest
```

## Architecture

Carry over the structural *intent* from the SwiftUI app rather than its literal file layout — see `../GoodParent` for reference behavior, and `docs/adr/` for why each of the following was decided this way for this port specifically:

- **Persistence & accounts** — the SwiftUI app uses local SwiftData with an unused CloudKit entitlement. This port uses **Convex** (hosted, real-time) for persistence and **Clerk** for real sign-in, with Convex validating Clerk-issued JWTs via `ConvexProviderWithClerk` (`convex/auth.config.ts`). This is a deliberate reversal of the original local-only, no-accounts premise — see `docs/adr/0005`. In Expo Go, use Clerk's custom flows (your own screens against Clerk's hooks), not its native prebuilt UI, which needs a dev client. Offline support is explicitly deferred, not built — the app currently requires connectivity.
- **Styling & components** — **NativeWind** (Tailwind-style utility classes) + **React Native Reusables** (shadcn/ui-style, copy-paste components built on NativeWind) — see `docs/adr/0006`. Port `DESIGN.md`'s tokens into the NativeWind/Tailwind config as-is; don't redesign them. Do not use `@expo/ui` alongside this (see that ADR for why).
- **Platform-conditional UI** — the SwiftUI app has an explicit macOS/iOS split in `ContentView.swift` (`NavigationSplitView` vs. flat list). This Expo port targets **iOS, Android, and web** (macOS itself is still out of scope). Mobile (iOS/Android) shares one single-column layout; web gets its own wider sidebar + detail-pane layout, not a scaled-up mobile view — see `DESIGN.md`'s Layout section and `docs/adr/0005`. Use `Platform.OS` checks where iOS and Android genuinely diverge from each other; use responsive/viewport logic (not `Platform.OS`) to distinguish mobile's single-column layout from web's sidebar layout.
- **Biometric gating** — the SwiftUI app gates Check-In and Journal entry with Face ID (`NSFaceIDUsageDescription`). The Expo equivalent is `expo-local-authentication`, as a local app-lock layered on top of (not instead of) Clerk sign-in, on mobile only.
- **Push notifications** — the SwiftUI app uses APNs background remote-notification mode for reminders. The Expo equivalent is `expo-notifications`.
- **Share** — the SwiftUI app hands off Parent Milestone / Child Milestone / Affirmation items to the OS share sheet (`docs/adr/0003`). The Expo equivalent is `expo-sharing` or `react-native-share`.
- **On-device AI for the Panic Button** — the SwiftUI app plans to use on-device Apple Intelligence specifically so conversation content never leaves the device (`docs/adr/0001-on-device-apple-intelligence-for-panic-button.md`). There is no direct Expo/React Native equivalent to Apple Intelligence; this decision needs to be revisited for this platform (an on-device small model runtime vs. a cloud LLM API trading away the "never leaves the device" guarantee) — treat it as open, not decided. **Do not default this to Convex** just because Convex now exists as this app's backend — see the note added to `docs/adr/0004`; this content is more sensitive than everything else Convex stores and needs its own explicit decision.

## Design system

`DESIGN.md` and `.impeccable/design.json` carry the same visual identity (Anthropic-derived warm paper/clay palette, Fraunces + Inter typefaces) as the SwiftUI app — these are framework-agnostic design tokens and should be ported as-is into the NativeWind/Tailwind config (`docs/adr/0006`), not redesigned. Load fonts via `@expo-google-fonts/fraunces` and `@expo-google-fonts/inter`. See `docs/adr/0001-adopt-anthropic-palette.md` and `docs/adr/0002-bundle-fraunces-inter-fonts.md` for why this palette/type pairing was chosen deliberately rather than tuned as inspiration — that reasoning still applies here.

## Working with the sibling SwiftUI project

`../GoodParent` is the reference implementation for product behavior and domain terminology — when in doubt about what a screen or flow should do, check it there. Do not copy its Swift source directly; re-implement the same behavior idiomatically for React Native/Expo.
