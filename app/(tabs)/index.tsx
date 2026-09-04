import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/icon";
import { useAppData } from "@/lib/app-data";
import { useIsWideWeb } from "@/lib/responsive";
import { colors } from "@/lib/theme";
import { useSemantic } from "@/lib/theme-context";

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

type Highlight = {
  icon: IconName;
  label: string;
  labelColor: string;
  date: string;
  text: string;
  tone: "default" | "accent";
};

export default function HomeScreen() {
  const semantic = useSemantic();
  const { state } = useAppData();
  const isWideWeb = useIsWideWeb();
  const now = new Date();
  const greeting = greetingFor(now.getHours());
  const todayLabel = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const lastJournal = state.journalEntries[state.journalEntries.length - 1];

  const highlights: Highlight[] = [
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

  const header = (
    <View className="flex-row justify-between items-center">
      <View>
        <Text className="font-display text-display-md" style={{ color: semantic.textHeading }}>
          {greeting}
        </Text>
        <Text className="font-sans text-body-sm mt-0.5" style={{ color: semantic.textMuted }}>
          {todayLabel}
        </Text>
      </View>
      <View className="flex-row items-center gap-1">
        {isWideWeb ? null : (
          <Pressable
            accessibilityLabel="Account"
            onPress={() => router.push("/account")}
            className="w-8 h-8 rounded-full items-center justify-center"
            style={{ backgroundColor: semantic.surfaceSunken }}
          >
            <Icon name="user" size={18} color={semantic.textMuted} />
          </Pressable>
        )}
      </View>
    </View>
  );

  const recapCard = (
    <Pressable onPress={() => router.push("/recap")}>
      <Card tone="sunken">
        <View className="flex-row items-center justify-between gap-1.5">
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
  );

  const checkinNudge = !state.checkedInToday ? (
    <Card tone="accent">
      <View className="flex-row items-center justify-between gap-1.5">
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
  ) : null;

  const quickActions = (
    <View className={isWideWeb ? "gap-2.5" : "flex-row justify-between"}>
      {QUICK_ACTIONS.map((a) =>
        isWideWeb ? (
          <Pressable
            key={a.label}
            onPress={() => router.push(a.href)}
            className="flex-row items-center gap-1.5 rounded-lg px-3.5 py-1.5"
            style={{ backgroundColor: semantic.surfaceCard }}
          >
            <View
              className="w-8 h-8 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.clay[50] }}
            >
              <Icon name={a.icon} size={17} color={colors.clay[400]} />
            </View>
            <Text className="font-sans-medium text-body-sm" style={{ color: semantic.textBody }}>
              {a.label}
            </Text>
          </Pressable>
        ) : (
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
        ),
      )}
    </View>
  );

  const lastJournalCard = lastJournal ? (
    <Card tone="sunken">
      <Text
        className="text-caption tracking-wide font-sans-semibold uppercase"
        style={{ color: semantic.textMuted }}
      >
        On this day
      </Text>
      <Text className="font-display mt-1.5" style={{ fontSize: 14.5, color: semantic.textHeading }}>
        {lastJournal.title}
      </Text>
      <Text className="font-sans text-body-sm mt-0.5" style={{ color: semantic.textBody }}>
        {lastJournal.body}
      </Text>
    </Card>
  ) : null;

  const highlightsList = (
    <View className="gap-1.5">
      {highlights.map((h, i) => (
        <Card key={i} tone={h.tone}>
          <View className="flex-row items-center gap-1.5 mb-1.5">
            <Icon name={h.icon} size={13} color={h.labelColor} />
            <Text className="text-caption tracking-wide font-sans-semibold" style={{ color: h.labelColor }}>
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
  );

  if (isWideWeb) {
    // Desktop: two columns instead of one stretched phone stack — the main feed (recap,
    // today's nudge, highlights) on the left, quick actions and this-day-in-history as a
    // standing side panel on the right, both visible without scrolling past each other.
    return (
      <ScrollView className="flex-1" style={{ backgroundColor: semantic.surfacePage }}>
        <View className="px-10 pt-10 pb-10" style={{ maxWidth: 1200, width: "100%", alignSelf: "center" }}>
          {header}
          <View className="flex-row gap-6 mt-4" style={{ alignItems: "flex-start" }}>
            <View className="gap-2" style={{ flex: 2 }}>
              {recapCard}
              {checkinNudge}
              <Text
                className="text-caption tracking-wide uppercase mt-1.5 mb-0.5"
                style={{ color: semantic.textSubtle }}
              >
                Highlights
              </Text>
              {highlightsList}
            </View>
            <View className="gap-2" style={{ flex: 1 }}>
              <Text className="text-caption tracking-wide uppercase" style={{ color: semantic.textSubtle }}>
                Quick actions
              </Text>
              {quickActions}
              {lastJournalCard}
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: semantic.surfacePage }}>
      <ScrollView className="flex-1" contentContainerClassName="px-4 pt-2 pb-28">
        {header}

        <View className="mt-2">{recapCard}</View>

        {checkinNudge ? <View className="mt-2">{checkinNudge}</View> : null}

        <View className="mt-3">{quickActions}</View>

        {lastJournalCard ? <View className="mt-2">{lastJournalCard}</View> : null}

        <Text
          className="text-caption tracking-wide uppercase mt-5 mb-2.5"
          style={{ color: semantic.textSubtle }}
        >
          Highlights
        </Text>
        {highlightsList}
      </ScrollView>
    </SafeAreaView>
  );
}
