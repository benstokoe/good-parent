import { useEffect, useState } from "react";
import { useAuth } from "@clerk/expo";
import { router } from "expo-router";
import { Platform, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/icon";
import { MarketingHomepage } from "@/components/web/MarketingHomepage";
import { colors } from "@/lib/theme";
import { useSemantic } from "@/lib/theme-context";

type Step = {
  title: string;
  body: string;
  icon: IconName;
  tour: boolean;
};

const STEPS: Step[] = [
  {
    title: "GoodParent",
    body: "A place to notice you're doing better than you think.",
    icon: "sparkles",
    tour: false,
  },
  {
    title: "Notice what's going right",
    body: "Most parenting apps tell you what to fix next. This one helps you see what you're already doing well.",
    icon: "circle-check",
    tour: false,
  },
  {
    title: "Private, always",
    body: "Check-ins, milestones and journal entries stay on your device. Nothing here is shared, scored or sent anywhere.",
    icon: "lock",
    tour: false,
  },
  {
    title: "Four ways in",
    body: "A quick look at what you'll find.",
    icon: "star",
    tour: true,
  },
];

const FEATURES: { icon: IconName; label: string; text: string }[] = [
  { icon: "circle-check", label: "Check-In", text: "Two minutes, three questions, most days." },
  { icon: "star", label: "Milestones", text: "For you, and for them." },
  { icon: "sparkles", label: "Affirmations", text: "A reminder, whenever you need one." },
  { icon: "message-square", label: "Panic Button", text: "A calmer minute, right when it’s hard." },
];

export default function OnboardingScreen() {
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/(tabs)");
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || isSignedIn) return null;

  // Web has no onboarding carousel: signed-out visitors get the marketing homepage
  // (which explains the product itself, per PRODUCT.md). Native keeps the carousel below.
  if (Platform.OS === "web") {
    return <MarketingHomepage />;
  }

  return <OnboardingCarousel />;
}

function OnboardingCarousel() {
  const semantic = useSemantic();
  const [step, setStep] = useState(0);
  const [cycleWord, setCycleWord] = useState<"Dad" | "Mum">("Dad");

  useEffect(() => {
    const id = setInterval(() => {
      setCycleWord((w) => (w === "Dad" ? "Mum" : "Dad"));
    }, 1800);
    return () => clearInterval(id);
  }, []);

  const current = STEPS[step];
  const isLast = step >= STEPS.length - 1;

  const finish = () => router.replace("/auth");

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: semantic.surfacePage }}>
      <View className="flex-1 px-4 pb-6">
        <View className="h-6 items-end justify-center">
          <Button variant="ghost" size="sm" onPress={finish}>
            Skip
          </Button>
        </View>

        <View className="flex-1 items-center justify-center gap-1.5 px-0.5">
          {current.tour ? (
            <>
              <View>
                <Text
                  className="font-display text-title-md text-center"
                  style={{ color: semantic.textHeading }}
                >
                  {current.title}
                </Text>
                <Text
                  className="font-sans text-body-sm text-center mt-1.5"
                  style={{ color: semantic.textMuted }}
                >
                  {current.body}
                </Text>
              </View>
              <View className="gap-2.5 w-full mt-0.5">
                {FEATURES.map((f) => (
                  <View
                    key={f.label}
                    className="flex-row items-center gap-2.5 rounded-lg px-1.5 py-2.5"
                    style={{ backgroundColor: colors.warm[100] }}
                  >
                    <View
                      className="w-[30px] h-[30px] rounded-full items-center justify-center"
                      style={{ backgroundColor: semantic.surfaceCard }}
                    >
                      <Icon name={f.icon} size={14} color={colors.clay[400]} />
                    </View>
                    <View className="flex-1">
                      <Text
                        className="font-sans-semibold text-body-sm"
                        style={{ color: semantic.textHeading }}
                      >
                        {f.label}
                      </Text>
                      <Text
                        className="font-sans text-caption mt-0.5"
                        style={{ color: semantic.textMuted }}
                      >
                        {f.text}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <>
              <View
                className="w-[76px] h-[76px] rounded-full items-center justify-center"
                style={{ backgroundColor: colors.clay[50] }}
              >
                <Icon name={current.icon} size={32} color={colors.clay[400]} />
              </View>
              <View>
                {step === 0 ? (
                  <View className="flex-row items-center justify-center flex-wrap gap-2.5">
                    <Text
                      className="font-display text-display-md"
                      style={{ color: semantic.textHeading }}
                    >
                      Good
                    </Text>
                    <View
                      className="rounded-lg px-2 py-0.5"
                      style={{
                        backgroundColor: cycleWord === "Dad" ? colors.skyTint : colors.manillaTint,
                      }}
                    >
                      <Text
                        className="font-display text-display-md"
                        style={{ color: semantic.textHeading }}
                      >
                        {cycleWord}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <Text
                    className="font-display text-title-md text-center"
                    style={{ color: semantic.textHeading }}
                  >
                    {current.title}
                  </Text>
                )}
                <Text
                  className="font-sans text-body-sm text-center mt-1"
                  style={{ color: semantic.textMuted }}
                >
                  {current.body}
                </Text>
              </View>
            </>
          )}
        </View>

        <View className="flex-row justify-center gap-1.5 mb-3">
          {STEPS.map((_, i) => (
            <View
              key={i}
              className="h-1.5 rounded-pill"
              style={{
                width: i === step ? 18 : 6,
                backgroundColor: i === step ? colors.clay[400] : colors.warm[200],
              }}
            />
          ))}
        </View>

        <View className="flex-row items-center justify-between">
          {step > 0 ? (
            <Button variant="secondary" size="lg" onPress={() => setStep((s) => Math.max(0, s - 1))}>
              Back
            </Button>
          ) : (
            <View />
          )}
          <Button
            variant="primary"
            size="lg"
            onPress={() => (isLast ? finish() : setStep((s) => s + 1))}
          >
            {isLast ? "Get started" : "Next"}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
