import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Icon, type IconName } from "@/components/ui/icon";
import { SearchInput } from "@/components/ui/SearchInput";
import { Tag } from "@/components/ui/Tag";
import { useAppData } from "@/lib/app-data";
import { colors } from "@/lib/theme";
import { useSemantic } from "@/lib/theme-context";

type TimelineType = "checkin" | "milestone" | "affirmation";
type Bucket = "Today" | "This Week" | "This Month" | "Earlier";

type TimelineEntry = {
  id: string;
  type: TimelineType;
  label: string;
  labelColor: string;
  dotBg: string;
  icon: IconName;
  iconColor: string;
  date: string;
  text: string;
  rank: number;
};

const FILTERS: { key: "all" | TimelineType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "checkin", label: "Check-Ins" },
  { key: "milestone", label: "Milestones" },
  { key: "affirmation", label: "Affirmations" },
];

const WEEKDAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

// Every source date is a relative label ("Today", "3d ago"), not a real timestamp — this
// ranks those labels so entries from different sources (check-ins, milestones) can be
// merged into one chronological, grouped feed instead of the fixed mock order this
// screen used to hardcode.
function rankForDate(label: string, now: Date): number {
  const key = label.trim().toLowerCase();
  if (key === "today" || key === "this morning" || key === "tonight") return 0;
  if (key === "yesterday") return 1;
  const weekday = WEEKDAYS.indexOf(key);
  if (weekday !== -1) {
    const diff = (now.getDay() - weekday + 7) % 7;
    return diff === 0 ? 7 : diff;
  }
  const match = key.match(/^(\d+)\s*(d|w|mo)\s*ago$/);
  if (match) {
    const n = Number(match[1]);
    return match[2] === "d" ? n : match[2] === "w" ? n * 7 : n * 30;
  }
  return 999;
}

function bucketForRank(rank: number): Bucket {
  if (rank <= 0) return "Today";
  if (rank <= 6) return "This Week";
  if (rank <= 29) return "This Month";
  return "Earlier";
}

export default function TimelineScreen() {
  const semantic = useSemantic();
  const { state } = useAppData();
  const [filter, setFilter] = useState<"all" | TimelineType>("all");
  const [search, setSearch] = useState("");

  const items = useMemo<TimelineEntry[]>(() => {
    const now = new Date();

    const checkinEntries: TimelineEntry[] = state.checkins.map((c) => ({
      id: c.id,
      type: "checkin",
      label: "CHECK-IN",
      labelColor: semantic.textAccent,
      dotBg: colors.clay[50],
      icon: "circle-check",
      iconColor: colors.clay[400],
      date: c.date,
      text: c.wentWell,
      rank: rankForDate(c.date, now),
    }));

    const parentEntries: TimelineEntry[] = state.parentMilestones.map((m) => ({
      id: m.id,
      type: "milestone",
      label: "PARENT MILESTONE",
      labelColor: colors.clay[600],
      dotBg: colors.clay[50],
      icon: "star",
      iconColor: colors.clay[400],
      date: m.date,
      text: m.title,
      rank: rankForDate(m.date, now),
    }));

    const childEntries: TimelineEntry[] = state.childMilestones.map((m) => ({
      id: m.id,
      type: "milestone",
      label: "CHILD MILESTONE",
      labelColor: semantic.textMuted,
      dotBg: semantic.surfaceSunken,
      icon: "check",
      iconColor: semantic.textMuted,
      date: m.date,
      text: m.title,
      rank: rankForDate(m.date, now),
    }));

    // No affirmation views are logged anywhere yet, so there's no real state to read —
    // this single fictional entry follows the same "clearly fictional sample" convention
    // as the rest of this app's seed data (see lib/app-data.tsx) until that's tracked.
    const affirmationEntries: TimelineEntry[] = [
      {
        id: "affirmation-sample-1",
        type: "affirmation",
        label: "AFFIRMATION",
        labelColor: colors.clay[600],
        dotBg: colors.clay[50],
        icon: "sparkles",
        iconColor: colors.clay[400],
        date: "This morning",
        text: "Said the affirmation before the school run.",
        rank: rankForDate("this morning", now),
      },
    ];

    return [...checkinEntries, ...parentEntries, ...childEntries, ...affirmationEntries].sort(
      (a, b) => a.rank - b.rank,
    );
  }, [state.checkins, state.parentMilestones, state.childMilestones, semantic]);

  const visible = items.filter(
    (t) =>
      (filter === "all" || t.type === filter) &&
      (!search.trim() || t.text.toLowerCase().includes(search.toLowerCase())),
  );

  // Grouping a list already sorted by rank is always contiguous — bucketForRank is a
  // monotonic step of rank, so this never needs to look ahead or re-sort.
  const groups = useMemo(() => {
    const out: { bucket: Bucket; entries: TimelineEntry[] }[] = [];
    for (const entry of visible) {
      const bucket = bucketForRank(entry.rank);
      const current = out[out.length - 1];
      if (current && current.bucket === bucket) current.entries.push(entry);
      else out.push({ bucket, entries: [entry] });
    }
    return out;
  }, [visible]);

  const hasActiveFilter = filter !== "all" || search.trim().length > 0;

  const clearFilters = () => {
    setFilter("all");
    setSearch("");
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: semantic.surfacePage }}>
      <ScrollView className="flex-1" contentContainerClassName="px-4 pt-2 pb-28" keyboardShouldPersistTaps="handled">
        <Text className="font-display text-display-md" style={{ color: semantic.textHeading }}>
          Timeline
        </Text>
        <Text className="font-sans text-body-sm mt-0.5" style={{ color: semantic.textMuted }}>
          Check-Ins, Milestones and Affirmations, in order. Unfiltered.
        </Text>

        <View className="mt-5">
          <SearchInput placeholder="Search timeline" value={search} onChangeText={setSearch} />
        </View>

        <View className="flex-row flex-wrap gap-2 mt-3">
          {FILTERS.map((f) => (
            <Tag key={f.key} selected={filter === f.key} onPress={() => setFilter(f.key)}>
              {f.label}
            </Tag>
          ))}
        </View>

        <View className="mt-5">
          {groups.length === 0 ? (
            <View className="items-center px-6 py-14">
              <View
                className="w-14 h-14 rounded-full items-center justify-center mb-3"
                style={{ backgroundColor: semantic.surfaceSunken }}
              >
                <Icon name="search" size={22} color={semantic.textAccent} />
              </View>
              <Text
                className="font-display text-title-sm text-center"
                style={{ color: semantic.textHeading }}
              >
                No matches
              </Text>
              <Text
                className="font-sans text-body-sm text-center mt-1 max-w-[280px]"
                style={{ color: semantic.textMuted }}
              >
                Try a different search, or clear your filters.
              </Text>
              {hasActiveFilter ? (
                <Pressable onPress={clearFilters} className="flex-row items-center gap-1 mt-3 py-1">
                  <Text className="font-sans-medium text-body-sm" style={{ color: semantic.textAccent }}>
                    Clear search and filters
                  </Text>
                </Pressable>
              ) : null}
            </View>
          ) : (
            groups.map((group, gi) => (
              <View key={group.bucket} className={gi > 0 ? "mt-7" : undefined}>
                <Text
                  className="text-caption tracking-wide uppercase mb-3"
                  style={{ color: semantic.textSubtle }}
                >
                  {group.bucket}
                </Text>
                {group.entries.map((t, i) => {
                  const isLast = i === group.entries.length - 1;
                  return (
                    <View key={t.id} className="flex-row gap-3">
                      <View className="items-center w-8">
                        <View
                          className="w-8 h-8 rounded-full items-center justify-center"
                          style={{ backgroundColor: t.dotBg }}
                        >
                          <Icon name={t.icon} size={14} color={t.iconColor} />
                        </View>
                        {isLast ? null : (
                          <View
                            className="w-0.5 flex-1 mt-1 rounded-full"
                            style={{ backgroundColor: semantic.borderSubtle }}
                          />
                        )}
                      </View>
                      <View className={isLast ? "flex-1 pb-1" : "flex-1 pb-6"}>
                        <View className="flex-row items-baseline justify-between gap-2">
                          <Text
                            className="text-caption font-sans-semibold"
                            style={{ color: t.labelColor }}
                          >
                            {t.label}
                          </Text>
                          <Text className="text-caption" style={{ color: semantic.textSubtle }}>
                            {t.date}
                          </Text>
                        </View>
                        <Text className="font-sans text-body-md mt-1" style={{ color: semantic.textBody }}>
                          {t.text}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
