import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card } from "@/components/ui/Card";
import { Icon, type IconName } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/IconButton";
import { Tabs } from "@/components/ui/Tabs";
import { WebContainer } from "@/components/web/WebContainer";
import { useAppData } from "@/lib/app-data";
import { colors } from "@/lib/theme";
import { useSemantic } from "@/lib/theme-context";

const CADENCE_OPTIONS = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

export default function RecapScreen() {
  const semantic = useSemantic();
  const { state, updateSettings } = useAppData();
  const cadence = state.settings.recapCadence;
  const isWeekly = cadence === "weekly";

  const stats = isWeekly
    ? [
        { value: "3", label: "Check-ins" },
        { value: "2", label: "Milestones" },
        { value: "4", label: "Day streak" },
      ]
    : [
        { value: "11", label: "Check-ins" },
        { value: "5", label: "Milestones" },
        { value: "18", label: "Journal entries" },
      ];

  const highlights: { icon: IconName; label: string; labelColor: string; date: string; text: string }[] = [
    {
      icon: "circle-check",
      label: "CHECK-IN",
      labelColor: semantic.textAccent,
      date: "Yesterday",
      text: state.checkins[0]?.wentWell ?? "",
    },
    {
      icon: "star",
      label: "PARENT MILESTONE",
      labelColor: colors.clay[600],
      date: "3d ago",
      text: "Handled a 45-minute tantrum without raising my voice.",
    },
    {
      icon: "pencil",
      label: "JOURNAL",
      labelColor: semantic.textMuted,
      date: "1w ago",
      text: state.journalEntries[1]?.body ?? state.journalEntries[0]?.body ?? "",
    },
  ];

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: semantic.surfacePage }}>
      <WebContainer maxWidth={640} style={{ flex: 1 }}>
      <View className="flex-row items-center justify-between gap-2.5 px-6 pt-4 pb-3">
        <Text className="font-display text-title-sm" style={{ color: semantic.textHeading }}>
          Your recap
        </Text>
        <IconButton name="x" label="Close" onPress={() => router.back()} />
      </View>

      <View className="px-6 pb-4">
        <Tabs
          items={CADENCE_OPTIONS}
          value={cadence}
          onChange={(v) => updateSettings({ recapCadence: v as "weekly" | "monthly" })}
        />
      </View>

      <ScrollView className="flex-1" contentContainerClassName="px-6 pb-6">
        <Text
          className="font-display text-title-sm mb-3.5"
          style={{ fontSize: 18, color: semantic.textHeading }}
        >
          {isWeekly ? "This week" : "This month"}
        </Text>
        <View className="flex-row gap-2 mb-5">
          {stats.map((s) => (
            <Card key={s.label} tone="accent" style={{ flex: 1 }}>
              <Text className="font-display" style={{ fontSize: 22, color: semantic.textHeading }}>
                {s.value}
              </Text>
              <Text className="text-caption mt-0.5" style={{ color: semantic.textMuted }}>
                {s.label}
              </Text>
            </Card>
          ))}
        </View>

        <Text
          className="text-caption tracking-wide uppercase mb-2.5"
          style={{ color: semantic.textSubtle }}
        >
          What stood out
        </Text>
        <View className="gap-3">
          {highlights.map((h, i) => (
            <Card key={i}>
              <View className="flex-row items-center gap-1.5 mb-1.5">
                <Icon name={h.icon} size={13} color={h.labelColor} />
                <Text
                  className="text-caption tracking-wide font-sans-semibold"
                  style={{ color: h.labelColor }}
                >
                  {h.label}
                </Text>
                <Text className="text-caption ml-auto" style={{ color: semantic.textSubtle }}>
                  {h.date}
                </Text>
              </View>
              <Text className="font-sans text-body-sm" style={{ color: semantic.textBody }}>
                {h.text}
              </Text>
            </Card>
          ))}
        </View>
      </ScrollView>
      </WebContainer>
    </SafeAreaView>
  );
}
