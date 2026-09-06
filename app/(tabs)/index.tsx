import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/icon";
import { useAppData } from "@/lib/app-data";
import { colors, fontFamily, typography } from "@/lib/theme";
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
    <View style={styles.header}>
      <View>
        <Text style={[styles.greeting, { color: semantic.textHeading }]}>{greeting}</Text>
        <Text style={[styles.dateLabel, { color: semantic.textMuted }]}>{todayLabel}</Text>
      </View>
      <View style={styles.headerActions}>
        <Pressable
          accessibilityLabel="Account"
          onPress={() => router.push("/account")}
          style={[styles.accountButton, { backgroundColor: semantic.surfaceSunken }]}
        >
          <Icon name="user" size={20} color={semantic.textMuted} />
        </Pressable>
      </View>
    </View>
  );

  const recapCard = (
    <Pressable onPress={() => router.push("/recap")}>
      <Card tone="sunken" padding="lg">
        <View style={styles.rowBetween}>
          <View>
            <Text style={[styles.sectionLabel, { color: semantic.textMuted }]}>YOUR WEEK</Text>
            <Text style={[styles.recapTitle, { color: semantic.textHeading }]}>
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
      <View style={styles.rowBetween}>
        <View style={styles.flex1}>
          <Text style={[styles.checkinTitle, { color: semantic.textHeading }]}>
            Haven&apos;t checked in today
          </Text>
          <Text style={[styles.bodySmMt1, { color: semantic.textMuted }]}>
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
    <View style={styles.quickActionsRow}>
      {QUICK_ACTIONS.map((a) => (
        <Pressable key={a.label} onPress={() => router.push(a.href)} style={styles.quickAction}>
          <View style={[styles.quickActionIcon, { backgroundColor: colors.clay[50] }]}>
            <Icon name={a.icon} size={20} color={colors.clay[400]} />
          </View>
          <Text style={[typography.caption, styles.textCenter, { color: semantic.textBody }]}>
            {a.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );

  // One recent moment as proof there's more, then a plain link to the full run on
  // Timeline — not a second scrollable list competing with the one above it.
  const recentSection = (
    <View style={styles.recentSection}>
      <Card tone={recentHighlight.tone} padding="lg">
        <View style={styles.recentHeaderRow}>
          <Icon name={recentHighlight.icon} size={13} color={recentHighlight.labelColor} />
          <Text style={[styles.sectionLabel, { color: recentHighlight.labelColor }]}>
            {recentHighlight.label}
          </Text>
          <Text style={[typography.caption, styles.marginLeftAuto, { color: semantic.textSubtle }]}>
            {recentHighlight.date}
          </Text>
        </View>
        <Text style={[typography.bodySM, { color: semantic.textBody }]}>{recentHighlight.text}</Text>
      </Card>
      <Pressable onPress={() => router.push("/timeline")} style={styles.seeAllRow}>
        <Text style={[styles.seeAllText, { color: semantic.textAccent }]}>See full timeline</Text>
        <Icon name="chevron-right" size={14} color={semantic.textAccent} />
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={[styles.flex1, { backgroundColor: semantic.surfacePage }]}>
      <ScrollView style={styles.flex1} contentContainerStyle={styles.scrollContent}>
        {header}

        <View style={styles.contentStack}>
          {todayCard}
          {quickActions}
          <View style={styles.recentGroup}>
            <Text style={[styles.recentGroupLabel, { color: semantic.textSubtle }]}>Recent</Text>
            {recentSection}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  greeting: typography.displayMD,
  dateLabel: { ...typography.bodySM, marginTop: 2 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 4 },
  accountButton: {
    width: 44,
    height: 44,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  sectionLabel: { ...typography.caption, fontFamily: fontFamily.bodySemibold, letterSpacing: 0.3 },
  recapTitle: { ...typography.titleSM, marginTop: 4, fontSize: 16 },
  checkinTitle: { ...typography.titleSM, fontSize: 17 },
  bodySmMt1: { ...typography.bodySM, marginTop: 4 },
  quickActionsRow: { flexDirection: "row", justifyContent: "space-between" },
  quickAction: { flex: 1, alignItems: "center", gap: 6 },
  quickActionIcon: {
    width: 46,
    height: 46,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  textCenter: { textAlign: "center" },
  recentSection: { gap: 10 },
  recentHeaderRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 },
  marginLeftAuto: { marginLeft: "auto" },
  seeAllRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 4,
  },
  seeAllText: { ...typography.bodySM, fontFamily: fontFamily.bodyMedium },
  scrollContent: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 112 },
  contentStack: { gap: 24, marginTop: 24 },
  recentGroup: { gap: 10 },
  recentGroupLabel: { ...typography.caption, letterSpacing: 0.3, textTransform: "uppercase" },
});
