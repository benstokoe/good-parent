import { createContext, useCallback, useContext, useMemo, useState } from "react";

// This app's data is not yet wired to Convex (see convex/schema.ts and the implementation
// report) — screens read/write through this in-memory context instead, seeded with the
// same sample content as the design mock, so every screen shares one consistent state
// tree the way the mock's single component did. Replacing this with live Convex
// queries/mutations per entity is the next step once a Convex project exists.

export type JournalEntry = {
  id: string;
  title: string;
  date: string;
  body: string;
  photoId: string;
};

export type ParentMilestone = { id: string; title: string; date: string; note: string };
export type ChildMilestone = { id: string; title: string; date: string; note: string; child?: string };

export type ActionItem = {
  id: string;
  text: string;
  source: string;
  lastRating?: string | null;
};

export type CheckIn = {
  id: string;
  date: string;
  wentWell: string;
  notWell: string;
  tags: string[];
};

export type ProfileRole = "mum" | "dad" | "parent";

export type Profile = {
  role: ProfileRole | null;
  duration: string;
  childCount: string;
  feeling: number | null;
  challenge: string;
};

export type ThemePreference = "system" | "light" | "dark";

export type Settings = {
  appLockEnabled: boolean;
  reminderEnabled: boolean;
  reminderTime: string;
  reminderFrequency: "daily" | "weekdays" | "few";
  recapCadence: "weekly" | "monthly";
  themePreference: ThemePreference;
};

type State = {
  journalEntries: JournalEntry[];
  parentMilestones: ParentMilestone[];
  childMilestones: ChildMilestone[];
  actionItemsOpen: ActionItem[];
  actionItemsResolved: ActionItem[];
  checkins: CheckIn[];
  checkedInToday: boolean;
  profile: Profile;
  settings: Settings;
  lockUnlocked: boolean;
};

const initialState: State = {
  journalEntries: [
    {
      id: "journal-1",
      photoId: "journal-photo-seed-1",
      title: "Weekend at Nan's",
      date: "3d ago",
      body: "Three hours in the car and she slept for two of them. We got chips on the way back and ate them in the car park because neither of us wanted the drive to end yet.",
    },
    {
      id: "journal-2",
      photoId: "journal-photo-seed-2",
      title: "The blanket fort",
      date: "1w ago",
      body: "Turned the living room upside down for a blanket fort that lasted about four minutes before it collapsed. She thought that was the funniest part.",
    },
    {
      id: "journal-3",
      photoId: "journal-photo-seed-3",
      title: "Just tired",
      date: "2w ago",
      body: "Some days I don't have a story, I'm just tired. Writing that down so it's somewhere other than in my head.",
    },
  ],
  parentMilestones: [
    {
      id: "pm-1",
      title: "Survived the first year",
      date: "2mo ago",
      note: "Twelve months in. Some days it still feels made up that we're doing this.",
    },
    {
      id: "pm-2",
      title: "Handled a 45-minute tantrum without raising my voice",
      date: "3d ago",
      note: "Stayed on the floor next to her the whole time. Did not fix it, just stayed.",
    },
    {
      id: "pm-3",
      title: "Asked for help",
      date: "1w ago",
      note: "Called my sister instead of pretending I had it handled.",
    },
  ],
  childMilestones: [
    {
      id: "cm-1",
      title: "First steps",
      date: "5w ago",
      note: "Three wobbly steps toward the sofa, then straight back to crawling for a week.",
      child: "Nora",
    },
    {
      id: "cm-2",
      title: 'Said "no" for the first time',
      date: "5d ago",
      note: "A milestone in more ways than one.",
      child: "Nora",
    },
    {
      id: "cm-3",
      title: "Slept through the night",
      date: "2w ago",
      note: "Eleven hours. I still woke up twice out of habit.",
    },
  ],
  actionItemsOpen: [
    {
      id: "ai-1",
      text: "Leave 10 minutes earlier so mornings aren't a countdown.",
      source: "yesterday's check-in",
      lastRating: null,
    },
    {
      id: "ai-2",
      text: "Phone in the other room during dinner.",
      source: "Monday's check-in",
      lastRating: "Better",
    },
  ],
  actionItemsResolved: [
    {
      id: "ai-3",
      text: "Say one thing I noticed out loud, every day.",
      source: "Resolved after 2 weeks",
    },
  ],
  checkins: [
    {
      id: "ci-1",
      date: "Yesterday",
      wentWell: "Read two extra books at bedtime without rushing, and she asked for a third.",
      notWell: "Snapped when she wouldn't put her shoes on for the third time.",
      tags: [],
    },
    {
      id: "ci-2",
      date: "Monday",
      wentWell:
        "Stayed calm through the supermarket meltdown and gave her a choice instead of a command.",
      notWell: "Was on my phone during dinner and missed most of what she was saying.",
      tags: [],
    },
    {
      id: "ci-3",
      date: "Saturday",
      wentWell: "Let the day be slow. No plans, just the two of us at the park.",
      notWell: "Felt guilty for wanting an hour alone, then took it anyway.",
      tags: [],
    },
  ],
  checkedInToday: false,
  profile: { role: null, duration: "", childCount: "", feeling: null, challenge: "" },
  settings: {
    appLockEnabled: true,
    reminderEnabled: true,
    reminderTime: "20:00",
    reminderFrequency: "daily",
    recapCadence: "weekly",
    themePreference: "system",
  },
  lockUnlocked: false,
};

type Ctx = {
  state: State;
  addJournalEntry: (title: string, body: string) => void;
  addMilestone: (kind: "parent" | "child", title: string, note: string) => void;
  resolveActionItem: (id: string) => void;
  submitCheckin: (input: {
    wentWell: string;
    notWell: string;
    tags: string[];
    actionItemText: string;
  }) => void;
  setProfile: (partial: Partial<Profile>) => void;
  updateSettings: (partial: Partial<Settings>) => void;
  unlockApp: () => void;
};

const AppDataContext = createContext<Ctx | null>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(initialState);

  const addJournalEntry = useCallback((title: string, body: string) => {
    setState((s) => ({
      ...s,
      journalEntries: [
        {
          id: `journal-${Date.now()}`,
          photoId: `journal-photo-${Date.now()}`,
          title: title.trim() || "Untitled",
          date: "Today",
          body: body.trim(),
        },
        ...s.journalEntries,
      ],
    }));
  }, []);

  const addMilestone = useCallback((kind: "parent" | "child", title: string, note: string) => {
    setState((s) => {
      if (kind === "parent") {
        return {
          ...s,
          parentMilestones: [
            { id: `pm-${Date.now()}`, title: title.trim(), date: "Today", note: note.trim() },
            ...s.parentMilestones,
          ],
        };
      }
      return {
        ...s,
        childMilestones: [
          {
            id: `cm-${Date.now()}`,
            title: title.trim(),
            date: "Today",
            note: note.trim(),
            child: "Nora",
          },
          ...s.childMilestones,
        ],
      };
    });
  }, []);

  const resolveActionItem = useCallback((id: string) => {
    setState((s) => {
      const item = s.actionItemsOpen.find((a) => a.id === id);
      if (!item) return s;
      return {
        ...s,
        actionItemsOpen: s.actionItemsOpen.filter((a) => a.id !== id),
        actionItemsResolved: [
          { id: item.id, text: item.text, source: "Resolved today" },
          ...s.actionItemsResolved,
        ],
      };
    });
  }, []);

  const submitCheckin = useCallback(
    (input: { wentWell: string; notWell: string; tags: string[]; actionItemText: string }) => {
      setState((s) => {
        const actionItemsOpen = input.actionItemText.trim()
          ? [
              {
                id: `ai-${Date.now()}`,
                text: input.actionItemText.trim(),
                source: "today's check-in",
                lastRating: null,
              },
              ...s.actionItemsOpen,
            ]
          : s.actionItemsOpen;
        return {
          ...s,
          checkins: [
            {
              id: `ci-${Date.now()}`,
              date: "Today",
              wentWell: input.wentWell,
              notWell: input.notWell,
              tags: input.tags,
            },
            ...s.checkins,
          ],
          actionItemsOpen,
          checkedInToday: true,
        };
      });
    },
    [],
  );

  const setProfile = useCallback((partial: Partial<Profile>) => {
    setState((s) => ({ ...s, profile: { ...s.profile, ...partial } }));
  }, []);

  const updateSettings = useCallback((partial: Partial<Settings>) => {
    setState((s) => ({ ...s, settings: { ...s.settings, ...partial } }));
  }, []);

  const unlockApp = useCallback(() => {
    setState((s) => ({ ...s, lockUnlocked: true }));
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      state,
      addJournalEntry,
      addMilestone,
      resolveActionItem,
      submitCheckin,
      setProfile,
      updateSettings,
      unlockApp,
    }),
    [state, addJournalEntry, addMilestone, resolveActionItem, submitCheckin, setProfile, updateSettings, unlockApp],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
