import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/icon";
import { useAppData } from "@/lib/app-data";
import { colors, semantic } from "@/lib/theme";

const QUICK_ACTIONS: { icon: IconName; label: string; href: "/checkin" | "/affirmation" | "/milestones" | "/burn" }[] = [
  { icon: "circle-check", label: "Check-In", href: "/checkin" },
  { icon: "sparkles", label: "Affirmation", href: "/affirmation" },
  { icon: "star", label: "Milestones", href: "/milestones" },
  { icon: "x", label: "Burn", href: "/burn" },
];

function greetingFor(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function HomeScreen() {
  const { state } = useAppData();
  const now = new Date();
  const greeting = greetingFor(now.getHours());
  const todayLabel = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const lastJournal = state.journalEntries[state.journalEntries.length - 1];

  const highlights: {
    icon: IconName;
    label: string;
    labelColor: string;
    date: string;
    text: string;
    tone: "default" | "accent";
  }[] = [
    {
      icon: "circle-check",
      label: "CHECK-IN",
      labelColor: semantic.textAccent,
      date: "Yesterday",
      text: state.checkins[0]?.wentWell ?? "",
      tone: "default",
    },
    {
      icon: "star",
      label: "PARENT MILESTONE",
      labelColor: colors.clay[600],
      date: "3d ago",
      text: "Handled a 45-minute tantrum without raising my voice.",
      tone: "accent",
    },
    {
      icon: "pencil",
      label: "JOURNAL",
      labelColor: semantic.textMuted,
      date: "1w ago",
      text: state.journalEntries[1]?.body ?? state.journalEntries[0]?.body ?? "",
      tone: "default",
    },
    {
      icon: "check",
      label: "CHILD MILESTONE",
      labelColor: semantic.textMuted,
      date: "5d ago",
      text: 'Said "no" for the first time.',
      tone: "default",
    },
  ];

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: semantic.surfacePage }}>
      <ScrollView className="flex-1 px-6 pt-16" contentContainerClassName="pb-6">
        <View className="flex-row justify-between items-start">
          <View>
            <Text className="font-display text-display-md" style={{ color: semantic.textHeading }}>
              {greeting}
            </Text>
            <Text className="font-sans text-body-sm mt-0.5" style={{ color: semantic.textMuted }}>
              {todayLabel}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <View
              className="flex-row items-center gap-1.5 rounded-pill pl-2 pr-2.5 py-1.5"
              style={{ backgroundColor: colors.warm[100] }}
            >
              <Icon name="lock" size={12} color={semantic.textMuted} />
              <Text className="text-caption" style={{ color: semantic.textMuted }}>
                Private to you
              </Text>
            </View>
            <Pressable
              accessibilityLabel="Account"
              onPress={() => router.push("/account")}
              className="w-8 h-8 rounded-full items-center justify-center"
            >
              <Icon name="user" size={18} color={semantic.textMuted} />
            </Pressable>
          </View>
        </View>

        <Pressable onPress={() => router.push("/recap")} className="mt-4">
          <Card tone="sunken">
            <View className="flex-row items-center justify-between gap-3">
              <View>
                <Text
                  className="text-caption tracking-wide font-sans-semibold"
                  style={{ color: semantic.textMuted }}
                >
                  YOUR WEEK
                </Text>
                <Text
                  className="font-display text-title-sm mt-0.5"
                  style={{ fontSize: 15, color: semantic.textHeading }}
                >
                  3 check-ins, 2 milestones. Worth a look.
                </Text>
              </View>
              <Icon name="chevron-right" size={16} color={semantic.textMuted} />
            </View>
          </Card>
        </Pressable>

        {!state.checkedInToday ? (
          <View className="mt-4">
            <Card tone="accent">
              <View className="flex-row items-center justify-between gap-3">
                <View className="flex-1">
                  <Text
                    className="font-display text-title-sm"
                    style={{ fontSize: 16, color: semantic.textHeading }}
                  >
                    Haven&apos;t checked in today
                  </Text>
                  <Text className="font-sans text-body-sm mt-0.5" style={{ color: semantic.textMuted }}>
                    Two minutes, three questions.
                  </Text>
                </View>
                <Button variant="primary" size="sm" onPress={() => router.push("/checkin")}>
                  Start
                </Button>
              </View>
            </Card>
          </View>
        ) : null}

        <View className="flex-row justify-between mt-5">
          {QUICK_ACTIONS.map((a) => (
            <Pressable
              key={a.label}
              onPress={() => router.push(a.href)}
              className="flex-1 items-center gap-1.5"
            >
              <View
                className="w-[46px] h-[46px] rounded-full items-center justify-center"
                style={{ backgroundColor: colors.clay[50] }}
              >
                <Icon name={a.icon} size={20} color={colors.clay[400]} />
              </View>
              <Text className="text-caption text-center" style={{ color: semantic.textBody }}>
                {a.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {lastJournal ? (
          <Card tone="sunken" style={{ marginTop: 16 }}>
            <Text
              className="text-caption tracking-wide font-sans-semibold uppercase"
              style={{ color: semantic.textMuted }}
            >
              On this day
            </Text>
            <Text
              className="font-display mt-1.5"
              style={{ fontSize: 14.5, color: semantic.textHeading }}
            >
              {lastJournal.title}
            </Text>
            <Text className="font-sans text-body-sm mt-0.5" style={{ color: semantic.textBody }}>
              {lastJournal.body}
            </Text>
          </Card>
        ) : null}

        <Text
          className="text-caption tracking-wide uppercase mt-7 mb-2.5"
          style={{ color: semantic.textSubtle }}
        >
          Highlights
        </Text>
        <View className="gap-3">
          {highlights.map((h, i) => (
            <Card key={i} tone={h.tone}>
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
    </SafeAreaView>
  );
}
