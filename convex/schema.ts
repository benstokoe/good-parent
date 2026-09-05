import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Domain tables reflecting CONTEXT.md's glossary. Every table is scoped to a single
// account via `userId` (the Clerk subject) — this app is single-tenant-per-account,
// so every query/mutation added later must filter by the caller's own userId.
//
// Not yet wired up: this schema is ready for `npx convex dev`, but no queries/mutations
// exist yet (they'd import from `convex/_generated`, which only exists after that command
// runs) and no screen reads from Convex yet — see the implementation report for what's
// still local-only state.
export default defineSchema({
  profiles: defineTable({
    userId: v.string(),
    role: v.union(v.literal("mum"), v.literal("dad"), v.literal("parent")),
    parentingDuration: v.string(),
    childCount: v.string(),
    feeling: v.number(),
    challenge: v.optional(v.string()),
  }).index("by_user", ["userId"]),

  accountSettings: defineTable({
    userId: v.string(),
    appLockEnabled: v.boolean(),
    reminderEnabled: v.boolean(),
    reminderTime: v.string(),
    reminderFrequency: v.union(v.literal("daily"), v.literal("weekdays"), v.literal("few")),
    recapCadence: v.union(v.literal("weekly"), v.literal("monthly")),
  }).index("by_user", ["userId"]),

  checkIns: defineTable({
    userId: v.string(),
    wentWell: v.string(),
    notWell: v.string(),
    rating: v.optional(
      v.union(v.literal("Better"), v.literal("About the same"), v.literal("Still hard")),
    ),
    tags: v.array(v.string()),
  }).index("by_user", ["userId"]),

  actionItems: defineTable({
    userId: v.string(),
    text: v.string(),
    source: v.string(),
    status: v.union(v.literal("open"), v.literal("resolved")),
    lastRating: v.optional(v.string()),
    resolvedAt: v.optional(v.number()),
  }).index("by_user_and_status", ["userId", "status"]),

  journalEntries: defineTable({
    userId: v.string(),
    title: v.string(),
    body: v.string(),
    photoStorageIds: v.optional(v.array(v.id("_storage"))),
  }).index("by_user", ["userId"]),

  parentMilestones: defineTable({
    userId: v.string(),
    title: v.string(),
    note: v.string(),
  }).index("by_user", ["userId"]),

  childMilestones: defineTable({
    userId: v.string(),
    child: v.string(),
    title: v.string(),
    note: v.string(),
  }).index("by_user", ["userId"]),

  affirmationLog: defineTable({
    userId: v.string(),
    text: v.string(),
  }).index("by_user", ["userId"]),
});
