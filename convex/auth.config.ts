// Convex validates Clerk-issued JWTs against this config — see docs/adr/0005.
// EXPO_PUBLIC_CLERK_ISSUER_URL is your Clerk instance's issuer URL (Clerk dashboard →
// your app → JWT templates → "convex" template → Issuer). Not set yet: this app has no
// real Convex/Clerk project wired up, see the implementation report.
export default {
  providers: [
    {
      domain: process.env.EXPO_PUBLIC_CLERK_ISSUER_URL,
      applicationID: "convex",
    },
  ],
};
