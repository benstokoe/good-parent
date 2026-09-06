import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/IconButton";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { Tag } from "@/components/ui/Tag";
import { Textarea } from "@/components/ui/Textarea";
import { useAppData } from "@/lib/app-data";
import { colors } from "@/lib/theme";
import { useSemantic } from "@/lib/theme-context";
import { useVoiceRecognition } from "@/lib/use-voice-recognition";

const RATING_OPTIONS = [
  { value: "Better", label: "Better" },
  { value: "About the same", label: "About the same" },
  { value: "Still hard", label: "Still hard" },
];

const WENT_WELL_TAGS = ["Solo parenting", "Extra help", "Good day"];
const NOT_WELL_TAGS = ["No sleep", "Solo parenting", "Sick kid", "Long day"];

type CheckinField = "wentWell" | "notWell";

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

  const setFieldText = (field: CheckinField, text: string) =>
    field === "wentWell" ? setWentWell(text) : setNotWell(text);

  const { isAvailable: isVoiceAvailable, recordingField, toggleRecording } =
    useVoiceRecognition<CheckinField>({ onTranscript: setFieldText });

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
      className="flex-1"
      edges={["top", "left", "right"]}
      style={{ backgroundColor: semantic.surfacePage }}
    >
      <View className="flex-row items-center justify-between gap-2.5 px-6 pt-6 pb-3">
        <Text className="font-display text-title-sm" style={{ color: semantic.textHeading }}>
          Check-In
        </Text>
        <IconButton name="x" label="Close" onPress={() => router.back()} />
      </View>
      <View className="flex-row gap-1.5 px-6 pb-3">
        {dots.map((active, i) => (
          <View
            key={i}
            className="h-0.5 flex-1 rounded-pill"
            style={{ backgroundColor: active ? colors.clay[400] : colors.warm[200] }}
          />
        ))}
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pb-3"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {step === 0 ? (
          <>
            <Text
              className="text-caption tracking-wide uppercase mb-1"
              style={{ color: semantic.textSubtle }}
            >
              Following up
            </Text>
            <Text
              className="font-display text-title-sm mb-3.5"
              style={{ fontSize: 19, color: semantic.textHeading }}
            >
              Last time you were working on this
            </Text>
            <Card tone="sunken">
              <Text className="font-sans text-body-md" style={{ color: semantic.textBody }}>
                {state.actionItemsOpen[0]?.text}
              </Text>
            </Card>
            <View className="mt-3">
              <RadioGroup options={RATING_OPTIONS} value={rating} onChange={setRating} />
            </View>
          </>
        ) : null}

        {step === 1 ? (
          <View className="flex-1">
            <View className="flex-row items-center justify-between mb-3.5">
              <Text
                className="font-display text-title-sm"
                style={{ fontSize: 19, color: semantic.textHeading }}
              >
                What went well today?
              </Text>
              {isVoiceAvailable ? (
                <IconButton
                  name="mic"
                  label="Record a voice note"
                  variant={recordingField === "wentWell" ? "primary" : "secondary"}
                  onPress={() => toggleRecording("wentWell", wentWell)}
                />
              ) : null}
            </View>
            <View className="flex-row flex-wrap gap-2 mb-5">
              {WENT_WELL_TAGS.map((tag) => (
                <Tag key={tag} selected={tags.includes(tag)} onPress={() => toggleTag(tag)}>
                  {tag}
                </Tag>
              ))}
            </View>
            {recordingField === "wentWell" ? (
              <Text className="text-caption mb-2.5" style={{ color: semantic.textMuted }}>
                Listening… tap the mic to stop.
              </Text>
            ) : null}
            <Textarea
              style={{ flex: 1 }}
              placeholder="A moment, big or small…"
              value={wentWell}
              onChangeText={setWentWell}
            />
          </View>
        ) : null}

        {step === 2 ? (
          <View className="flex-1">
            <View className="flex-row items-center justify-between mb-3.5">
              <Text
                className="font-display text-title-sm"
                style={{ fontSize: 19, color: semantic.textHeading }}
              >
                What didn&apos;t go so well?
              </Text>
              {isVoiceAvailable ? (
                <IconButton
                  name="mic"
                  label="Record a voice note"
                  variant={recordingField === "notWell" ? "primary" : "secondary"}
                  onPress={() => toggleRecording("notWell", notWell)}
                />
              ) : null}
            </View>
            <View className="flex-row flex-wrap gap-2 mb-5">
              {NOT_WELL_TAGS.map((tag) => (
                <Tag key={tag} selected={tags.includes(tag)} onPress={() => toggleTag(tag)}>
                  {tag}
                </Tag>
              ))}
            </View>
            {recordingField === "notWell" ? (
              <Text className="text-caption mb-2.5" style={{ color: semantic.textMuted }}>
                Listening… tap the mic to stop.
              </Text>
            ) : null}
            <Textarea
              style={{ flex: 1 }}
              placeholder="It's fine for this to be honest."
              value={notWell}
              onChangeText={setNotWell}
            />
          </View>
        ) : null}

        {step === 3 ? (
          <>
            <Text
              className="font-display text-title-sm mb-1.5"
              style={{ fontSize: 19, color: semantic.textHeading }}
            >
              Anything to work on?
            </Text>
            <Text className="font-sans text-body-sm mb-3.5" style={{ color: semantic.textMuted }}>
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
          <View className="items-center pt-10">
            <View
              className="w-24 h-24 rounded-full items-center justify-center mb-2"
              style={{ backgroundColor: colors.greenTint }}
            >
              <Icon name="check" size={24} color={colors.green} />
            </View>
            <Text className="font-display text-title-md" style={{ color: semantic.textHeading }}>
              Check-in saved
            </Text>
            <Text
              className="font-sans text-body-sm mt-1.5 text-center max-w-[260px]"
              style={{ color: semantic.textMuted }}
            >
              It&apos;s on your Timeline, and any highlights will surface on your Homepage.
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <View
        className="flex-row gap-2.5 px-6 pt-3 border-t"
        style={{ borderColor: semantic.borderSubtle, paddingBottom: insets.bottom + 32 }}
      >
        {step > firstStep && step < 4 ? (
          <Button variant="secondary" onPress={back}>
            Back
          </Button>
        ) : null}
        {step < 4 ? (
          <View className="flex-1">
            <Button variant="primary" fullWidth onPress={next}>
              {step === 3 ? "Save check-in" : "Continue"}
            </Button>
          </View>
        ) : (
          <View className="flex-1">
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
