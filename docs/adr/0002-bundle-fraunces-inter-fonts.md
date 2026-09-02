# Bundle Fraunces + Inter instead of native system fonts

GoodParent's typography follows Anthropic's serif-heading / sans-body pattern (their real fonts, Styrene and Tiempos, are commercial and not available to license for this project). The free, native option was the OS system font pairing (SF Pro + New York on iOS, Roboto on Android), which ships at zero cost and zero setup. We chose instead to bundle Fraunces (serif, headings) and Inter (sans, body/UI) — both open-source, SIL OFL-licensed Google Fonts — because they sit visually closer to Anthropic's actual typefaces than the platform system fonts do.

This is a deliberate deviation from the obvious/free path: it costs app size and font-loading setup that native fonts wouldn't. A future reader might reasonably ask "why not just use the system font" — the answer is closer brand fidelity to the Anthropic-styling brief was worth the one-time setup cost.

**Expo note:** load both families via `expo-font` (either `@expo-google-fonts/fraunces` + `@expo-google-fonts/inter`, or bundled `.ttf` assets loaded with `useFonts()`) rather than any native-only font API. This decision originated on the SwiftUI version of GoodParent (`../GoodParent`) but carries over unchanged — the type pairing doesn't depend on platform.
