import { ConvexReactClient } from "convex/react";

// EXPO_PUBLIC_CONVEX_URL comes from `npx convex dev` (it writes it to .env.local).
// No real Convex project is deployed yet — see the implementation report — so this
// client has nothing to talk to until that's set up.
const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;

export const convex = new ConvexReactClient(convexUrl ?? "https://placeholder.convex.cloud", {
  unsavedChangesWarning: false,
});
