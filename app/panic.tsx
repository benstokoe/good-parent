import { router } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { BreathingOrb } from "@/components/BreathingOrb";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";
import { Tabs } from "@/components/ui/Tabs";
import { AFFIRMATIONS } from "@/lib/affirmations";
import { colors, fontFamily, typography } from "@/lib/theme";
import { useSemantic } from "@/lib/theme-context";

type PanicTab = "breathe" | "affirmations" | "talk";

const BREATHE_SEQUENCE: [string, number][] = [
  ["Breathe in", 4000],
  ["Hold", 4000],
  ["Breathe out", 6000],
];

type Message = { role: "assistant" | "user"; text: string };

export default function PanicScreen() {
  const semantic = useSemantic();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<PanicTab>("breathe");
  const [breatheCue, setBreatheCue] = useState(BREATHE_SEQUENCE[0][0]);
  const [showCrisis, setShowCrisis] = useState(false);
  const [affirmIndex, setAffirmIndex] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "What's going on right now?" },
  ]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (tab !== "breathe") return;
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const step = () => {
      setBreatheCue(BREATHE_SEQUENCE[i][0]);
      timer = setTimeout(() => {
        i = (i + 1) % BREATHE_SEQUENCE.length;
        step();
      }, BREATHE_SEQUENCE[i][1]);
    };
    step();
    return () => clearTimeout(timer);
  }, [tab]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    // On-device-vs-cloud AI for this conversation is an explicitly open decision
    // (docs/adr/0004) — this must not silently call a cloud LLM. Only a static
    // fallback response is wired up until that decision is made with the user.
    setMessages((m) => [
      ...m,
      { role: "user", text },
      {
        role: "assistant",
        text: "Couldn't respond just now. Try Breathe or Affirmations, or reach out to one of the resources above if you need more support.",
      },
    ]);
    setInput("");
  };

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={[styles.flex1, { backgroundColor: semantic.surfacePage }]}
    >
      <View style={styles.header}>
        <Text style={[typography.titleSM, styles.displayFont, { color: semantic.textHeading }]}>
          Panic Button
        </Text>
        <IconButton name="x" label="Close" onPress={() => router.back()} />
      </View>

      <View style={styles.crisisSection}>
        <Card tone="sunken" padding="sm">
          <View style={styles.crisisRow}>
            <Icon name="triangle-alert" size={15} color={colors.amber} />
            <Text style={[typography.caption, styles.flex1, { color: semantic.textMuted, lineHeight: 18 }]}>
              A lightweight coping tool, not crisis care.{" "}
              <Text
                style={[styles.sansMedium, { color: semantic.textLink }]}
                onPress={() => setShowCrisis((s) => !s)}
              >
                See real help
              </Text>
            </Text>
          </View>
        </Card>
        {showCrisis ? (
          <View style={styles.crisisCards}>
            <Card padding="sm">
              <Text style={[typography.caption, { color: semantic.textBody }]}>
                <Text style={styles.sansSemibold}>988 Suicide &amp; Crisis Lifeline</Text> — call
                or text 988, 24/7
              </Text>
            </Card>
            <Card padding="sm">
              <Text style={[typography.caption, { color: semantic.textBody }]}>
                <Text style={styles.sansSemibold}>Crisis Text Line</Text> — text HOME to 741741
              </Text>
            </Card>
          </View>
        ) : null}
      </View>

      <View style={styles.tabsSection}>
        <Tabs
          items={[
            { value: "breathe", label: "Breathe" },
            { value: "affirmations", label: "Affirmations" },
            { value: "talk", label: "Talk it through" },
          ]}
          value={tab}
          onChange={(v) => setTab(v as PanicTab)}
        />
      </View>

      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView style={styles.flex1} contentContainerStyle={styles.scrollContent}>
          {tab === "breathe" ? (
            <View style={styles.breatheContainer}>
              <View style={styles.orbWrap}>
                <BreathingOrb size={130} colors={[colors.clay[300], colors.clay[500]]} durationMs={14000} />
              </View>
              <Text style={[typography.titleSM, styles.displayFont, { color: semantic.textHeading }]}>
                {breatheCue}
              </Text>
              <Text style={[typography.caption, styles.mt1, { color: semantic.textMuted }]}>
                4 seconds in, 4 hold, 6 out
              </Text>
            </View>
          ) : null}

          {tab === "affirmations" ? (
            <View style={styles.affirmationsContainer}>
              <Text style={[typography.titleSM, styles.displayFont, { fontSize: 19, color: semantic.textHeading }]}>
                I am a good parent.
              </Text>
              <Text
                style={[typography.bodySM, styles.affirmationText, { color: semantic.textMuted, minHeight: 50 }]}
              >
                {AFFIRMATIONS[affirmIndex % AFFIRMATIONS.length]}
              </Text>
              <View style={styles.mt3}>
                <Button
                  variant="secondary"
                  onPress={() => setAffirmIndex((i) => (i + 1) % AFFIRMATIONS.length)}
                >
                  Next
                </Button>
              </View>
            </View>
          ) : null}

          {tab === "talk" ? (
            <>
              <View style={styles.encryptedRow}>
                <Icon name="lock" size={12} color={semantic.textMuted} />
                <Text style={[typography.caption, { color: semantic.textMuted }]}>
                  On-device · nothing here is saved or sent anywhere
                </Text>
              </View>
              <View style={styles.messagesList}>
                {messages.map((m, i) => (
                  <View
                    key={i}
                    style={[styles.messageWrap, { alignSelf: m.role === "user" ? "flex-end" : "flex-start" }]}
                  >
                    <View
                      style={[
                        styles.messageBubble,
                        { backgroundColor: m.role === "user" ? semantic.actionPrimary : colors.warm[100] },
                      ]}
                    >
                      <Text
                        style={[
                          typography.bodySM,
                          { color: m.role === "user" ? "#fff" : semantic.textBody, lineHeight: 20 },
                        ]}
                      >
                        {m.text}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          ) : null}
        </ScrollView>

        {tab === "talk" ? (
          <View
            style={[
              styles.inputRow,
              { borderColor: semantic.borderSubtle, paddingBottom: insets.bottom + 32 },
            ]}
          >
            <View style={styles.flex1}>
              <Input
                placeholder="What's going on right now?"
                value={input}
                onChangeText={setInput}
                onSubmitEditing={send}
              />
            </View>
            <IconButton name="send" label="Send" variant="secondary" onPress={send} />
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  displayFont: { fontFamily: typography.titleSM.fontFamily },
  sansMedium: { fontFamily: fontFamily.bodyMedium },
  sansSemibold: { fontFamily: fontFamily.bodySemibold },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 12,
  },
  crisisSection: { paddingHorizontal: 24, paddingBottom: 10 },
  crisisRow: { flexDirection: "row", alignItems: "flex-start", gap: 4 },
  crisisCards: { marginTop: 4, gap: 6 },
  tabsSection: { paddingHorizontal: 24 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 24 },
  breatheContainer: { alignItems: "center", paddingTop: 24 },
  orbWrap: { marginBottom: 16 },
  mt1: { marginTop: 4 },
  mt3: { marginTop: 12 },
  affirmationsContainer: { alignItems: "center", paddingTop: 32 },
  affirmationText: { textAlign: "center", marginTop: 8 },
  encryptedRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  messagesList: { gap: 10 },
  messageWrap: { maxWidth: "82%" },
  messageBubble: { borderRadius: 24, paddingHorizontal: 14, paddingVertical: 10 },
  inputRow: {
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 24,
    paddingTop: 6,
    borderTopWidth: 1,
  },
});
