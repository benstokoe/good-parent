import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/icon";
import { useAppData } from "@/lib/app-data";
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
  const now = new Date();
  const greeting = greetingFor(now.getHours());
  const todayLabel = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Just the single most recent moment — the full run lives on the Timeline tab,
  // so Home only needs to prove there's something worth looking back at.
  const recentHighlight: Highlight = {
    icon: "star",
    label: "PARENT MILESTONE",
    labelColor: colors.clay[600],
    date: "3d ago",
    text: "Handled a 45-minute tantrum without raising my voice.",
    tone: "accent",
  };

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
        <Pressable
          accessibilityLabel="Account"
          onPress={() => router.push("/account")}
          className="w-11 h-11 rounded-full items-center justify-center"
          style={{ backgroundColor: semantic.surfaceSunken }}
        >
          <Icon name="user" size={20} color={semantic.textMuted} />
        </Pressable>
      </View>
    </View>
  );

  const recapCard = (
    <Pressable onPress={() => router.push("/recap")}>
      <Card tone="sunken" padding="lg">
        <View className="flex-row items-center justify-between gap-2">
          <View>
            <Text
              className="text-caption tracking-wide font-sans-semibold"
              style={{ color: semantic.textMuted }}
            >
              YOUR WEEK
            </Text>
            <Text
              className="font-display text-title-sm mt-1"
              style={{ fontSize: 16, color: semantic.textHeading }}
            >
              3 check-ins, 2 milestones. Worth a look.
            </Text>
          </View>
          <Icon name="chevron-right" size={16} color={semantic.textMuted} />
        </View>
      </Card>
    </Pressable>
  );

  const checkinNudge = (
    <Card tone="accent" padding="lg">
      <View className="flex-row items-center justify-between gap-2">
        <View className="flex-1">
          <Text
            className="font-display text-title-sm"
            style={{ fontSize: 17, color: semantic.textHeading }}
          >
            Haven&apos;t checked in today
          </Text>
          <Text className="font-sans text-body-sm mt-1" style={{ color: semantic.textMuted }}>
            Two minutes, three questions.
          </Text>
        </View>
        <Button variant="primary" size="sm" onPress={() => router.push("/checkin")}>
          Start
        </Button>
      </View>
    </Card>
  );

  // Today only ever shows one card — the more urgent nudge to check in, or the
  // week's recap once that's already done — rather than stacking both.
  const todayCard = !state.checkedInToday ? checkinNudge : recapCard;

  const quickActions = (
    <View className="flex-row justify-between">
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
  );

  // One recent moment as proof there's more, then a plain link to the full run on
  // Timeline — not a second scrollable list competing with the one above it.
  const recentSection = (
    <View className="gap-2.5">
      <Card tone={recentHighlight.tone} padding="lg">
        <View className="flex-row items-center gap-1.5 mb-2">
          <Icon name={recentHighlight.icon} size={13} color={recentHighlight.labelColor} />
          <Text
            className="text-caption tracking-wide font-sans-semibold"
            style={{ color: recentHighlight.labelColor }}
          >
            {recentHighlight.label}
          </Text>
          <Text className="text-caption ml-auto" style={{ color: semantic.textSubtle }}>
            {recentHighlight.date}
          </Text>
        </View>
        <Text className="font-sans text-body-sm" style={{ color: semantic.textBody }}>
          {recentHighlight.text}
        </Text>
      </Card>
      <Pressable
        onPress={() => router.push("/timeline")}
        className="flex-row items-center justify-center gap-1 py-1"
      >
        <Text className="font-sans-medium text-body-sm" style={{ color: semantic.textAccent }}>
          See full timeline
        </Text>
        <Icon name="chevron-right" size={14} color={semantic.textAccent} />
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: semantic.surfacePage }}>
      <ScrollView className="flex-1" contentContainerClassName="px-4 pt-3 pb-28">
        {header}

        <View className="gap-6 mt-6">
          {todayCard}
          {quickActions}
          <View className="gap-2.5">
            <Text
              className="text-caption tracking-wide uppercase"
              style={{ color: semantic.textSubtle }}
            >
              Recent
            </Text>
            {recentSection}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
