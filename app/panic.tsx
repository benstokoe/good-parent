import { router } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { BreathingOrb } from "@/components/BreathingOrb";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";
import { Tabs } from "@/components/ui/Tabs";
import { WebContainer } from "@/components/web/WebContainer";
import { AFFIRMATIONS } from "@/lib/affirmations";
import { colors } from "@/lib/theme";
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
      className="flex-1"
      edges={["top", "left", "right"]}
      style={{ backgroundColor: semantic.surfacePage }}
    >
      <WebContainer maxWidth={560} style={{ flex: 1 }}>
      <View className="flex-row items-center justify-between gap-2.5 px-6 pt-6 pb-3">
        <Text className="font-display text-title-sm" style={{ color: semantic.textHeading }}>
          Panic Button
        </Text>
        <IconButton name="x" label="Close" onPress={() => router.back()} />
      </View>

      <View className="px-6 pb-2.5">
        <Card tone="sunken" padding="sm">
          <View className="flex-row items-start gap-1">
            <Icon name="triangle-alert" size={15} color={colors.amber} />
            <Text className="font-sans text-caption flex-1" style={{ color: semantic.textMuted, lineHeight: 18 }}>
              A lightweight coping tool, not crisis care.{" "}
              <Text
                className="font-sans-medium"
                style={{ color: semantic.textLink }}
                onPress={() => setShowCrisis((s) => !s)}
              >
                See real help
              </Text>
            </Text>
          </View>
        </Card>
        {showCrisis ? (
          <View className="mt-1 gap-1.5">
            <Card padding="sm">
              <Text className="font-sans text-caption" style={{ color: semantic.textBody }}>
                <Text className="font-sans-semibold">988 Suicide &amp; Crisis Lifeline</Text> — call
                or text 988, 24/7
              </Text>
            </Card>
            <Card padding="sm">
              <Text className="font-sans text-caption" style={{ color: semantic.textBody }}>
                <Text className="font-sans-semibold">Crisis Text Line</Text> — text HOME to 741741
              </Text>
            </Card>
          </View>
        ) : null}
      </View>

      <View className="px-6">
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
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
      <ScrollView className="flex-1" contentContainerClassName="px-6 pt-2 pb-6">
        {tab === "breathe" ? (
          <View className="items-center pt-6">
            <View className="mb-4">
              <BreathingOrb size={130} colors={[colors.clay[300], colors.clay[500]]} durationMs={14000} />
            </View>
            <Text className="font-display text-title-sm" style={{ color: semantic.textHeading }}>
              {breatheCue}
            </Text>
            <Text className="text-caption mt-1" style={{ color: semantic.textMuted }}>
              4 seconds in, 4 hold, 6 out
            </Text>
          </View>
        ) : null}

        {tab === "affirmations" ? (
          <View className="items-center pt-8">
            <Text className="font-display text-title-sm" style={{ fontSize: 19, color: semantic.textHeading }}>
              I am a good parent.
            </Text>
            <Text
              className="font-sans text-body-sm text-center mt-2"
              style={{ color: semantic.textMuted, minHeight: 50 }}
            >
              {AFFIRMATIONS[affirmIndex % AFFIRMATIONS.length]}
            </Text>
            <View className="mt-3">
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
            <View className="flex-row items-center gap-1.5 mb-1.5">
              <Icon name="lock" size={12} color={semantic.textMuted} />
              <Text className="text-caption" style={{ color: semantic.textMuted }}>
                On-device · nothing here is saved or sent anywhere
              </Text>
            </View>
            <View className="gap-2.5">
              {messages.map((m, i) => (
                <View key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "82%" }}>
                  <View
                    className="rounded-2xl px-3.5 py-2.5"
                    style={{
                      backgroundColor: m.role === "user" ? semantic.actionPrimary : colors.warm[100],
                    }}
                  >
                    <Text
                      className="font-sans text-body-sm"
                      style={{ color: m.role === "user" ? "#fff" : semantic.textBody, lineHeight: 20 }}
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
          className="flex-row gap-1 px-6 pt-1.5 border-t"
          style={{ borderColor: semantic.borderSubtle, paddingBottom: insets.bottom + 32 }}
        >
          <View className="flex-1">
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
      </WebContainer>
    </SafeAreaView>
  );
}
