import { router } from "expo-router";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import { useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/IconButton";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { Tag } from "@/components/ui/Tag";
import { Textarea } from "@/components/ui/Textarea";
import { useAppData } from "@/lib/app-data";
import { colors, radius, typography } from "@/lib/theme";
import { useSemantic } from "@/lib/theme-context";

const RATING_OPTIONS = [
  { value: "Better", label: "Better" },
  { value: "About the same", label: "About the same" },
  { value: "Still hard", label: "Still hard" },
];

const WENT_WELL_TAGS = ["Solo parenting", "Extra help", "Good day"];
const NOT_WELL_TAGS = ["No sleep", "Solo parenting", "Sick kid", "Long day"];

export default function CheckinScreen() {
  const semantic = useSemantic();
  const insets = useSafeAreaInsets();
  const { state, submitCheckin } = useAppData();
  const hasFollowUp = state.actionItemsOpen.length > 0;
  const firstStep = hasFollowUp ? 0 : 1;

  const [step, setStep] = useState(firstStep);
  const [rating, setRating] = useState<string | null>(null);
  const [wentWell, setWentWell] = useState("");
  const [notWell, setNotWell] = useState("");
  const [newActionItem, setNewActionItem] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [recordingField, setRecordingField] = useState<"wentWell" | "notWell" | null>(null);
  const baseTextRef = useRef("");

  const setFieldText = (field: "wentWell" | "notWell", text: string) =>
    field === "wentWell" ? setWentWell(text) : setNotWell(text);

  useSpeechRecognitionEvent("result", (event) => {
    if (!recordingField) return;
    const transcript = event.results[0]?.transcript ?? "";
    setFieldText(
      recordingField,
      baseTextRef.current ? `${baseTextRef.current} ${transcript}` : transcript,
    );
  });

  useSpeechRecognitionEvent("end", () => setRecordingField(null));
  useSpeechRecognitionEvent("error", () => setRecordingField(null));

  const toggleRecording = async (field: "wentWell" | "notWell") => {
    if (recordingField === field) {
      ExpoSpeechRecognitionModule.stop();
      return;
    }
    if (recordingField) {
      ExpoSpeechRecognitionModule.stop();
    }
    if (Platform.OS !== "web") {
      const { granted } = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!granted) return;
    }
    baseTextRef.current = field === "wentWell" ? wentWell : notWell;
    setRecordingField(field);
    ExpoSpeechRecognitionModule.start({
      lang: "en-US",
      interimResults: true,
      continuous: true,
    });
  };

  const toggleTag = (tag: string) =>
    setTags((t) => (t.includes(tag) ? t.filter((x) => x !== tag) : [...t, tag]));

  const back = () => setStep((s) => Math.max(firstStep, s - 1));
  const next = () => {
    if (step === 3) {
      submitCheckin({ wentWell, notWell, tags, actionItemText: newActionItem });
      setStep(4);
    } else {
      setStep((s) => s + 1);
    }
  };

  const dots = [0, 1, 2, 3].map((i) => i <= Math.min(step, 3));

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={[styles.flex1, { backgroundColor: semantic.surfacePage }]}
    >
      <View style={styles.header}>
        <Text style={[typography.titleSM, styles.displayFont, { color: semantic.textHeading }]}>
          Check-In
        </Text>
        <IconButton name="x" label="Close" onPress={() => router.back()} />
      </View>
      <View style={styles.dotsRow}>
        {dots.map((active, i) => (
          <View
            key={i}
            style={[styles.dot, { backgroundColor: active ? colors.clay[400] : colors.warm[200] }]}
          />
        ))}
      </View>

      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView style={styles.flex1} contentContainerStyle={styles.scrollContent}>
          {step === 0 ? (
            <>
              <Text style={[typography.caption, styles.followUpLabel, { color: semantic.textSubtle }]}>
                Following up
              </Text>
              <Text
                style={[typography.titleSM, styles.displayFont, styles.stepTitleMb35, { fontSize: 19, color: semantic.textHeading }]}
              >
                Last time you were working on this
              </Text>
              <Card tone="sunken">
                <Text style={[typography.bodyMD, { color: semantic.textBody }]}>
                  {state.actionItemsOpen[0]?.text}
                </Text>
              </Card>
              <View style={styles.mt3}>
                <RadioGroup options={RATING_OPTIONS} value={rating} onChange={setRating} />
              </View>
            </>
          ) : null}

          {step === 1 ? (
            <View style={styles.flex1}>
              <View style={styles.stepHeaderRow}>
                <Text style={[typography.titleSM, styles.displayFont, { fontSize: 19, color: semantic.textHeading }]}>
                  What went well today?
                </Text>
                <IconButton
                  name="mic"
                  label="Record a voice note"
                  variant={recordingField === "wentWell" ? "primary" : "secondary"}
                  onPress={() => toggleRecording("wentWell")}
                />
              </View>
              <View style={styles.tagsRow}>
                {WENT_WELL_TAGS.map((tag) => (
                  <Tag key={tag} selected={tags.includes(tag)} onPress={() => toggleTag(tag)}>
                    {tag}
                  </Tag>
                ))}
              </View>
              {recordingField === "wentWell" ? (
                <Text style={[typography.caption, styles.listeningLabel, { color: semantic.textMuted }]}>
                  Listening… tap the mic to stop.
                </Text>
              ) : null}
              <Textarea
                style={styles.flex1}
                placeholder="A moment, big or small…"
                value={wentWell}
                onChangeText={setWentWell}
              />
            </View>
          ) : null}

          {step === 2 ? (
            <View style={styles.flex1}>
              <View style={styles.stepHeaderRow}>
                <Text style={[typography.titleSM, styles.displayFont, { fontSize: 19, color: semantic.textHeading }]}>
                  What didn&apos;t go so well?
                </Text>
                <IconButton
                  name="mic"
                  label="Record a voice note"
                  variant={recordingField === "notWell" ? "primary" : "secondary"}
                  onPress={() => toggleRecording("notWell")}
                />
              </View>
              <View style={styles.tagsRow}>
                {NOT_WELL_TAGS.map((tag) => (
                  <Tag key={tag} selected={tags.includes(tag)} onPress={() => toggleTag(tag)}>
                    {tag}
                  </Tag>
                ))}
              </View>
              {recordingField === "notWell" ? (
                <Text style={[typography.caption, styles.listeningLabel, { color: semantic.textMuted }]}>
                  Listening… tap the mic to stop.
                </Text>
              ) : null}
              <Textarea
                style={styles.flex1}
                placeholder="It's fine for this to be honest."
                value={notWell}
                onChangeText={setNotWell}
              />
            </View>
          ) : null}

          {step === 3 ? (
            <>
              <Text
                style={[typography.titleSM, styles.displayFont, styles.stepTitleMb15, { fontSize: 19, color: semantic.textHeading }]}
              >
                Anything to work on?
              </Text>
              <Text style={[typography.bodySM, styles.stepSubtitleMb35, { color: semantic.textMuted }]}>
                Optional. This becomes an Action Item and comes back around in a future Check-In.
              </Text>
              <Textarea
                rows={5}
                placeholder="A small, specific change…"
                value={newActionItem}
                onChangeText={setNewActionItem}
              />
            </>
          ) : null}

          {step === 4 ? (
            <View style={styles.doneContainer}>
              <View style={[styles.doneIconCircle, { backgroundColor: colors.greenTint }]}>
                <Icon name="check" size={24} color={colors.green} />
              </View>
              <Text style={[typography.titleMD, styles.displayFont, { color: semantic.textHeading }]}>
                Check-in saved
              </Text>
              <Text style={[typography.bodySM, styles.doneSubtitle, { color: semantic.textMuted }]}>
                It&apos;s on your Timeline, and any highlights will surface on your Homepage.
              </Text>
            </View>
          ) : null}
        </ScrollView>

        <View
          style={[
            styles.footer,
            { borderColor: semantic.borderSubtle, paddingBottom: insets.bottom + 32 },
          ]}
        >
          {step > firstStep && step < 4 ? (
            <Button variant="secondary" onPress={back}>
              Back
            </Button>
          ) : null}
          {step < 4 ? (
            <View style={styles.flex1}>
              <Button variant="primary" fullWidth onPress={next}>
                {step === 3 ? "Save check-in" : "Continue"}
              </Button>
            </View>
          ) : (
            <View style={styles.flex1}>
              <Button variant="primary" fullWidth onPress={() => router.back()}>
                Done
              </Button>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  displayFont: { fontFamily: typography.titleSM.fontFamily },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 12,
  },
  dotsRow: { flexDirection: "row", gap: 6, paddingHorizontal: 24, paddingBottom: 12 },
  dot: { height: 2, flex: 1, borderRadius: radius.pill },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 12, flexGrow: 1 },
  followUpLabel: { letterSpacing: 0.3, textTransform: "uppercase", marginBottom: 4 },
  stepTitleMb35: { marginBottom: 14 },
  stepTitleMb15: { marginBottom: 6 },
  stepSubtitleMb35: { marginBottom: 14 },
  mt3: { marginTop: 12 },
  stepHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  listeningLabel: { marginBottom: 10 },
  doneContainer: { alignItems: "center", paddingTop: 40 },
  doneIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  doneSubtitle: { marginTop: 6, textAlign: "center", maxWidth: 260 },
  footer: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 24,
    paddingTop: 12,
    borderTopWidth: 1,
  },
});
