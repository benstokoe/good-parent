# Adopt Anthropic's exact colour palette as GoodParent's brand identity

GoodParent needed a colour scheme that reads as warm, friendly, and trustworthy rather than clinical. Instead of designing an original palette, we adopted Anthropic/Claude's published colours verbatim: background `#FAF9F5`, text `#141413`, primary accent (clay) `#D97757`, secondary blue `#6A9BCC`, secondary green `#788C5D`, and their 9-step neutral grey ramp (`#E9E8E4` → `#000000`) for surfaces and secondary text in both light and dark mode.

We considered treating Anthropic's palette as inspiration only and tuning it softer/warmer for a family app, but chose verbatim adoption for a stronger, more deliberate visual identity. This is a real trade-off: the palette isn't domain-derived (nothing here says "parenting app"), so a future reader may assume it was picked arbitrarily or copied by accident — it wasn't. Reverting would mean re-theming every screen.

**Expo note:** this decision originated on the SwiftUI version of GoodParent (`../GoodParent`) but carries over unchanged here — palette choice doesn't depend on platform. Implement it as a shared token module rather than native asset-catalog colors.
