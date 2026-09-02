# On-device AI for Panic Button conversation — open question for this platform

The Panic Button's AI-guided conversation processes a parent's raw emotional state during a struggling moment — private, mental-health-adjacent data in an app that promises the data is never shared with or seen by anyone else. On the SwiftUI version of GoodParent (`../GoodParent`, see its `docs/adr/0001-on-device-apple-intelligence-for-panic-button.md`), we decided to run this on-device via Apple Intelligence rather than call a cloud LLM API, so no conversation content ever leaves the device — trading away broader model capability and gating the feature to devices/OS versions that support it.

Apple Intelligence has no direct equivalent in Expo/React Native (it's a native, iOS-only, Apple-first-party API). This ADR exists to flag that the original decision does not port cleanly and needs to be made again for this platform, likely between:

- An on-device small-model runtime (e.g. `llama.rn`, MLC/WebLLM-in-RN, or a similar bundled model) — keeps the "never leaves the device" guarantee but adds significant app size, and model quality/latency on-device is a real constraint.
- A cloud LLM API — better quality and no bundling cost, but breaks the "never leaves the device" promise this feature was originally built around; would need its own privacy disclosure and probably a different framing of the guarantee.

This is deliberately left undecided — do not pick one silently while implementing the Panic Button; raise it with the user first.

**Note (see `docs/adr/0005`):** GoodParent now has a real backend (Convex) and real accounts (Clerk) for Check-Ins, Milestones, and Journal. Do not assume that backend is also the answer here — Panic Button conversation content is the most sensitive data in the app, and syncing it to Convex by default would resolve this ADR's open question silently, in the direction least consistent with the original "never leaves the device" intent. This still needs its own explicit decision.
