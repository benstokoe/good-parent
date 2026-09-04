import { useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Icon, type IconName } from "@/components/ui/icon";
import { Input } from "@/components/ui/Input";
import { Tag } from "@/components/ui/Tag";
import { WebContainer } from "@/components/web/WebContainer";
import { useAppData } from "@/lib/app-data";
import { colors } from "@/lib/theme";
import { useSemantic } from "@/lib/theme-context";

type TimelineType = "checkin" | "milestone" | "affirmation";

type TimelineEntry = {
  type: TimelineType;
  label: string;
  labelColor: string;
  dotBg: string;
  icon: IconName;
  iconColor: string;
  date: string;
  text: string;
};

const FILTERS: { key: "all" | TimelineType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "checkin", label: "Check-Ins" },
  { key: "milestone", label: "Milestones" },
  { key: "affirmation", label: "Affirmations" },
];

export default function TimelineScreen() {
  const semantic = useSemantic();
  const { state } = useAppData();
  const [filter, setFilter] = useState<"all" | TimelineType>("all");
  const [search, setSearch] = useState("");

  const items = useMemo<TimelineEntry[]>(
    () => [
      {
        type: "checkin",
        label: "CHECK-IN",
        labelColor: semantic.textAccent,
        dotBg: colors.clay[50],
        icon: "circle-check",
        iconColor: colors.clay[400],
        date: "Yesterday",
        text: state.checkins[0]?.wentWell ?? "",
      },
      {
        type: "affirmation",
        label: "AFFIRMATION",
        labelColor: colors.clay[600],
        dotBg: colors.clay[50],
        icon: "sparkles",
        iconColor: colors.clay[400],
        date: "This morning",
        text: "Said the affirmation before the school run.",
      },
      {
        type: "milestone",
        label: "PARENT MILESTONE",
        labelColor: colors.clay[600],
        dotBg: colors.clay[50],
        icon: "star",
        iconColor: colors.clay[400],
        date: "3d ago",
        text: "Handled a 45-minute tantrum without raising my voice.",
      },
      {
        type: "checkin",
        label: "CHECK-IN",
        labelColor: semantic.textAccent,
        dotBg: colors.clay[50],
        icon: "circle-check",
        iconColor: colors.clay[400],
        date: "Monday",
        text: state.checkins[1]?.wentWell ?? "",
      },
      {
        type: "milestone",
        label: "CHILD MILESTONE",
        labelColor: semantic.textMuted,
        dotBg: colors.warm[100],
        icon: "check",
        iconColor: semantic.textMuted,
        date: "5d ago",
        text: 'Said "no" for the first time.',
      },
      {
        type: "checkin",
        label: "CHECK-IN",
        labelColor: semantic.textAccent,
        dotBg: colors.clay[50],
        icon: "circle-check",
        iconColor: colors.clay[400],
        date: "Saturday",
        text: state.checkins[2]?.wentWell ?? "",
      },
      {
        type: "milestone",
        label: "PARENT MILESTONE",
        labelColor: colors.clay[600],
        dotBg: colors.clay[50],
        icon: "star",
        iconColor: colors.clay[400],
        date: "1w ago",
        text: "Asked for help instead of pretending I had it handled.",
      },
      {
        type: "milestone",
        label: "CHILD MILESTONE",
        labelColor: semantic.textMuted,
        dotBg: colors.warm[100],
        icon: "check",
        iconColor: semantic.textMuted,
        date: "2w ago",
        text: "Slept through the night.",
      },
      {
        type: "milestone",
        label: "CHILD MILESTONE",
        labelColor: semantic.textMuted,
        dotBg: colors.warm[100],
        icon: "check",
        iconColor: semantic.textMuted,
        date: "5w ago",
        text: "First steps.",
      },
      {
        type: "milestone",
        label: "PARENT MILESTONE",
        labelColor: colors.clay[600],
        dotBg: colors.clay[50],
        icon: "star",
        iconColor: colors.clay[400],
        date: "2mo ago",
        text: "Survived the first year.",
      },
    ],
    [state.checkins, semantic],
  );

  const visible = items.filter(
    (t) =>
      (filter === "all" || t.type === filter) &&
      (!search.trim() || t.text.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: semantic.surfacePage }}>
      <ScrollView className="flex-1" contentContainerClassName="px-4 pt-2 pb-28">
        <WebContainer maxWidth={640}>
        <Text className="font-display text-display-md" style={{ color: semantic.textHeading }}>
          Timeline
        </Text>
        <Text className="font-sans text-body-sm mt-0.5" style={{ color: semantic.textMuted }}>
          Check-Ins, Milestones and Affirmations, in order. Unfiltered.
        </Text>

        <View className="flex-row flex-wrap gap-2 mt-3.5">
          {FILTERS.map((f) => (
            <Tag key={f.key} selected={filter === f.key} onPress={() => setFilter(f.key)}>
              {f.label}
            </Tag>
          ))}
        </View>

        <View className="mt-1.5">
          <Input placeholder="Search timeline" value={search} onChangeText={setSearch} />
        </View>

        <View className="mt-2">
          {visible.map((t, i) => (
            <View key={i} className="flex-row gap-1.5">
              <View className="items-center w-[22px]">
                <View
                  className="w-[22px] h-[22px] rounded-full items-center justify-center"
                  style={{ backgroundColor: t.dotBg }}
                >
                  <Icon name={t.icon} size={11} color={t.iconColor} />
                </View>
                {i < visible.length - 1 ? (
                  <View className="w-px flex-1 mt-0.5" style={{ backgroundColor: semantic.borderSubtle }} />
                ) : null}
              </View>
              <View className="flex-1 pb-3">
                <View className="flex-row gap-1.5 items-baseline">
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
                <Text className="font-sans text-body-sm mt-0.5" style={{ color: semantic.textBody }}>
                  {t.text}
                </Text>
              </View>
            </View>
          ))}
        </View>
        </WebContainer>
      </ScrollView>
    </SafeAreaView>
  );
}
