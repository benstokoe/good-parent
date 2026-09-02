# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

## Users

A parent, using the app privately and alone (single-tenant per account — no shared/multi-party data model; one person's data is never visible to another). Aimed initially at the app's own creator, with an eventual App Store/Play Store/web release to other parents. The core moment of use is emotionally loaded: recording a Check-In, reaching for the Panic Button mid-struggle, or looking back at proof they're doing okay.

## Product Purpose

GoodParent helps a parent recognize and hold on to evidence that they *are* a good parent — the opposite of advice apps that tell them what to do. It doesn't coach or instruct; it reflects the good back at them. Success is a parent who, on a hard day, can open the app and find real, specific evidence that they're doing better than they feel.

## Positioning

Parenting apps are saturated with advice, tracking, and to-do framing (milestones as checklists, journals as logs, tips telling a parent what to do differently). GoodParent's mechanism is the inverse: it curates and resurfaces evidence of a parent's own good moments rather than prescribing improvement. Growth Space (what needs work) is deliberately separated from Homepage (curated positives) so the affirming view is never contaminated by open items — a structural commitment a generic journaling or parenting-advice app would not make.

## Operating Context

- Used in short, frequent private sessions, most often on a personal phone — often in the moment (Panic Button, Burn) or as a daily ritual (Check-In) — with a web client available for the same account.
- Data is private to the signed-in account (never visible to another account) but is no longer purely local — see Capabilities and Constraints below. The one deliberate additional exception is per-item Share (Parent Milestone, Child Milestone, Affirmation) via the OS-native share sheet — never Burn, Journal, or Check-In.
- The app currently requires connectivity (see Capabilities and Constraints — offline support is deferred, not absent by design).
- Biometric auth (`expo-local-authentication`) is intended to gate check-ins and journal entries on mobile, mirroring the Face ID gate on the SwiftUI version, as a local app-lock layered on top of (not instead of) account sign-in; voice notes are an optional input during Check-In (microphone permission).
- Push notifications (`expo-notifications`) are used for reminders.

## Capabilities and Constraints

- Expo/React Native (TypeScript), targeting iOS, Android, **and web** from a single codebase — web is a first-class target, not a byproduct (see `docs/adr/0005`). This is a port of a SwiftUI + SwiftData app (`../GoodParent`) that targets macOS as a first-class platform; macOS itself is still explicitly out of scope here, but web now fills a comparable "beyond phone" role for this port.
- Persistence is Convex (see `docs/adr/0005`) — a hosted, real-time backend, not the local-first SQLite/WatermelonDB layer originally scoped. This is a deliberate reversal of this app's original local-only premise, made to support cross-device account portability.
- Accounts are real: sign-in via Clerk, with Convex validating Clerk-issued JWTs (`ConvexProviderWithClerk`). This replaces the original "no accounts" premise for the same reason.
- Offline support is deferred, not built — the app currently requires connectivity for reads/writes. Documented as a known gap to revisit, particularly given Panic Button/Burn are meant for in-the-moment use.
- Panic Button conversation content is **not** automatically covered by the Convex decision — `docs/adr/0004` leaves on-device-vs-cloud AI processing for that specific, most-sensitive content an open question, deliberately unresolved. Do not sync it to Convex without raising that decision first.
- Distribution: personal use today, with an app-store release (App Store and/or Play Store) and a deployed web app (EAS Hosting) as a stated future goal — copy, empty states, and onboarding should be written for a stranger, not just the creator, going forward.

## Brand Commitments

- Name: GoodParent.
- An incumbent visual system exists already ("Clay" tokens imported from Claude Design — colors, typography, spacing, elevation; see `DESIGN.md` and `.impeccable/design.json`), including custom typefaces Fraunces (display/serif, warm) and Inter (UI/sans). These tokens are framework-agnostic and should be ported into this Expo project's theming layer as-is, not redesigned.
- Known and accepted risk: `docs/adr/0001`/`0002` record that this palette/type pairing was deliberately chosen to visually resemble Anthropic/Claude's brand, and that this was reviewed (three original replacement directions proposed) and deliberately kept for the SwiftUI version. Treat that as a confirmed, deliberate decision carried over to this port, not an oversight — do not re-raise it unprompted.
- Voice/tone is set by the domain terminology in `CONTEXT.md`: affirming, non-judgmental, deliberately avoiding generic productivity/tracking language (e.g. "Check-In" not "entry/log", "Burn" not "delete", "Growth Space" not "to-do list").

## Evidence on Hand

No real user content, screenshots, or store copy exist yet. Sample/preview data used during development must stay clearly fictional and not be treated as testimonial or evidentiary content in future work.

## Product Principles

1. Reflect, don't instruct — the app curates evidence of good parenting rather than prescribing what to do differently.
2. Positives and open items stay structurally separate (Homepage vs. Growth Space) so encouragement is never undercut by unresolved to-dos.
3. Private by default — every feature defaults to on-device/local-only; sharing is a deliberate, per-item, explicit exception, never ambient.
4. iOS and Android are both real destinations for this port; design and code changes should hold up as first-class on either, not just get platform defaults on the one not being actively tested.
5. Write for a future stranger, not just the creator — since a store release is the goal, copy, onboarding, and empty states shouldn't assume the reader already knows the app's private vocabulary.

## Accessibility & Inclusion

No specific accessibility mandate beyond standard mobile OS baseline (dynamic text sizing, screen readers, sufficient contrast) — no special one-handed/thumb-reach or screen-reader-critical requirement was set, despite some flows (Panic Button, Check-In) occurring in emotionally raw moments.
