import { useEffect, useState } from "react";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/icon";
import { colors } from "@/lib/theme";
import { useSemantic } from "@/lib/theme-context";

// Signed-out web homepage — the direction locked in .impeccable/surfaces/web.md
// ("Quiet single statement", concept-seed key a604c6b8). Replaces the onboarding
// carousel's job on web only: app/index.tsx keeps that carousel unchanged for native.
const FEATURES: { icon: IconName; label: string; text: string }[] = [
  { icon: "circle-check", label: "Check-In", text: "Two minutes, three questions, most days." },
  { icon: "star", label: "Milestones", text: "For you, and for them." },
  { icon: "sparkles", label: "Affirmations", text: "A reminder, whenever you need one." },
  { icon: "message-square", label: "Panic Button", text: "A calmer minute, right when it's hard." },
];

function goToAuth() {
  router.push("/auth");
}

export function MarketingHomepage() {
  const semantic = useSemantic();
  const [cycleWord, setCycleWord] = useState<"Dad" | "Mum">("Dad");

  useEffect(() => {
    const id = setInterval(() => {
      setCycleWord((w) => (w === "Dad" ? "Mum" : "Dad"));
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <ScrollView className="flex-1" style={{ backgroundColor: semantic.surfacePage }}>
      <View className="flex-row items-center justify-between px-10 pt-8">
        <Text className="font-display text-title-sm" style={{ color: semantic.textHeading }}>
          GoodParent
        </Text>
        <Pressable onPress={goToAuth}>
          <Text className="font-sans-medium text-body-sm" style={{ color: semantic.textMuted }}>
            Sign in
          </Text>
        </Pressable>
      </View>

      <View className="items-center justify-center px-6" style={{ minHeight: 640 }}>
        <View className="items-center gap-5" style={{ maxWidth: 640 }}>
          <View className="flex-row items-center flex-wrap justify-center gap-3">
            <Text className="font-display text-display-xl" style={{ color: semantic.textHeading }}>
              Good
            </Text>
            <View
              className="rounded-lg px-5 py-1.5"
              style={{
                backgroundColor: cycleWord === "Dad" ? colors.skyTint : colors.manillaTint,
              }}
            >
              <Text className="font-display text-display-xl" style={{ color: semantic.textHeading }}>
                {cycleWord}
              </Text>
            </View>
          </View>
          <Text
            className="font-sans text-body-lg text-center"
            style={{ color: semantic.textMuted, maxWidth: 460 }}
          >
            A place to notice you&apos;re doing better than you think.
          </Text>
          <View className="mt-2">
            <Button variant="primary" size="lg" onPress={goToAuth}>
              Get started
            </Button>
          </View>
        </View>
      </View>

      <View className="items-center px-6 pb-20">
        <View style={{ maxWidth: 900, width: "100%" }}>
          <View
            className="flex-row items-stretch rounded-xl overflow-hidden mb-10"
            style={{ backgroundColor: colors.warm[100] }}
          >
            <View className="flex-1 p-8 gap-2">
              <Text
                className="text-caption tracking-wide font-sans-semibold uppercase"
                style={{ color: semantic.textSubtle }}
              >
                Most parenting apps
              </Text>
              <Text className="font-display text-title-sm" style={{ color: semantic.textMuted }}>
                Tell you what to fix next.
              </Text>
            </View>
            <View className="w-px" style={{ backgroundColor: semantic.borderSubtle }} />
            <View className="flex-1 p-8 gap-2" style={{ backgroundColor: colors.clay[50] }}>
              <Text
                className="text-caption tracking-wide font-sans-semibold uppercase"
                style={{ color: semantic.textAccent }}
              >
                GoodParent
              </Text>
              <Text className="font-display text-title-sm" style={{ color: semantic.textHeading }}>
                Helps you see what you&apos;re already doing well.
              </Text>
            </View>
          </View>

          <Text
            className="text-caption tracking-wide uppercase mb-4"
            style={{ color: semantic.textSubtle }}
          >
            Four ways in
          </Text>
          <View className="flex-row flex-wrap gap-4 mb-10">
            {FEATURES.map((f) => (
              <View
                key={f.label}
                className="rounded-lg p-5 gap-3"
                style={{ backgroundColor: semantic.surfaceCard, flexBasis: 200, flexGrow: 1 }}
              >
                <View
                  className="w-9 h-9 rounded-full items-center justify-center"
                  style={{ backgroundColor: colors.clay[50] }}
                >
                  <Icon name={f.icon} size={16} color={colors.clay[400]} />
                </View>
                <View>
                  <Text
                    className="font-sans-semibold text-body-md"
                    style={{ color: semantic.textHeading }}
                  >
                    {f.label}
                  </Text>
                  <Text className="font-sans text-body-sm mt-0.5" style={{ color: semantic.textMuted }}>
                    {f.text}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View className="flex-row items-center justify-between rounded-lg px-8 py-6" style={{ backgroundColor: colors.warm[100] }}>
            <View className="flex-1 pr-6 gap-1">
              <View className="flex-row items-center gap-1.5">
                <Icon name="lock" size={13} color={semantic.textMuted} />
                <Text className="text-caption font-sans-semibold" style={{ color: semantic.textMuted }}>
                  PRIVATE, ALWAYS
                </Text>
              </View>
              <Text className="font-sans text-body-sm" style={{ color: semantic.textBody, maxWidth: 480 }}>
                Check-ins, milestones and journal entries stay private to your account. Nothing
                here is shared, scored or sent anywhere.
              </Text>
            </View>
            <Button variant="primary" size="lg" onPress={goToAuth}>
              Get started
            </Button>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
