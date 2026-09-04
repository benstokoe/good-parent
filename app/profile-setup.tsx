import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Select } from "@/components/ui/Select";
import { Tag } from "@/components/ui/Tag";
import { Textarea } from "@/components/ui/Textarea";
import { WebContainer } from "@/components/web/WebContainer";
import { type Profile, useAppData } from "@/lib/app-data";
import { colors } from "@/lib/theme";
import { useSemantic } from "@/lib/theme-context";

const ROLE_OPTIONS: { value: NonNullable<Profile["role"]>; label: string }[] = [
  { value: "mum", label: "Mum" },
  { value: "dad", label: "Dad" },
  { value: "parent", label: "Parent" },
];

const DURATION_OPTIONS = [
  { value: "<1", label: "Less than a year" },
  { value: "1-3", label: "1–3 years" },
  { value: "4-7", label: "4–7 years" },
  { value: "8-12", label: "8–12 years" },
  { value: "13+", label: "13+ years" },
];

const CHILD_COUNT_OPTIONS = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4+", label: "4 or more" },
];

const FEELING_LABELS = [
  "Really struggling",
  "Having a hard time",
  "Some good days, some hard ones",
  "Doing pretty well",
  "Feeling good about it",
];

export default function ProfileSetupScreen() {
  const semantic = useSemantic();
  const { state, setProfile } = useAppData();
  const { profile } = state;

  const canContinue = !!profile.role && !!profile.duration && !!profile.childCount && !!profile.feeling;

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: semantic.surfacePage }}>
      <ScrollView className="flex-1" contentContainerClassName="px-6 pt-16 pb-8">
        <WebContainer maxWidth={520}>
        <View className="mb-6">
          <Text className="font-display text-title-md" style={{ color: semantic.textHeading }}>
            A little about you
          </Text>
          <Text className="font-sans text-body-sm mt-1" style={{ color: semantic.textMuted }}>
            This just helps us tailor things. Nothing here is shared.
          </Text>
        </View>

        <View className="gap-5">
          <View>
            <Text
              className="font-sans-semibold text-body-sm mb-2"
              style={{ color: semantic.textHeading }}
            >
              You are a
            </Text>
            <View className="flex-row gap-2">
              {ROLE_OPTIONS.map((opt) => (
                <View key={opt.value} className="flex-1">
                  <Tag
                    fullWidth
                    selected={profile.role === opt.value}
                    onPress={() => setProfile({ role: opt.value })}
                  >
                    {opt.label}
                  </Tag>
                </View>
              ))}
            </View>
          </View>

          <Field label="How long have you been a parent?">
            <Select
              options={DURATION_OPTIONS}
              value={profile.duration}
              onChange={(v) => setProfile({ duration: v })}
            />
          </Field>

          <Field label="How many children do you have?">
            <Select
              options={CHILD_COUNT_OPTIONS}
              value={profile.childCount}
              onChange={(v) => setProfile({ childCount: v })}
            />
          </Field>

          <View>
            <Text
              className="font-sans-semibold text-body-sm"
              style={{ color: semantic.textHeading }}
            >
              Right now, how good a parent do you feel like you are?
            </Text>
            <Text className="font-sans text-caption mb-2.5 mt-0.5" style={{ color: semantic.textMuted }}>
              {profile.feeling
                ? FEELING_LABELS[profile.feeling - 1]
                : "Tap the number closest to how you feel"}
            </Text>
            <View className="flex-row gap-2">
              {[1, 2, 3, 4, 5].map((n) => {
                const on = profile.feeling === n;
                return (
                  <Pressable
                    key={n}
                    onPress={() => setProfile({ feeling: n })}
                    className="flex-1 h-10 rounded-md border items-center justify-center"
                    style={{
                      backgroundColor: on ? colors.clay[400] : semantic.surfaceCard,
                      borderColor: semantic.borderDefault,
                    }}
                  >
                    <Text
                      className="font-sans-semibold text-body-md"
                      style={{ color: on ? "#fff" : semantic.textBody }}
                    >
                      {n}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Field label="Anything on your mind right now? (optional)">
            <Textarea
              rows={3}
              placeholder="A sleep regression, a rough morning, feeling stretched thin..."
              value={profile.challenge}
              onChangeText={(v) => setProfile({ challenge: v })}
            />
          </Field>
        </View>

        <View className="mt-8">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            disabled={!canContinue}
            onPress={() => router.replace("/(tabs)")}
          >
            Continue
          </Button>
        </View>
        </WebContainer>
      </ScrollView>
    </SafeAreaView>
  );
}
