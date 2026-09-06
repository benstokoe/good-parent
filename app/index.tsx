import { useEffect, useState } from "react";
import { useAuth } from "@clerk/expo";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/icon";
import { colors, fontFamily, typography } from "@/lib/theme";
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
    <SafeAreaView style={[styles.flex1, { backgroundColor: semantic.surfacePage }]}>
      <View style={styles.container}>
        <View style={styles.skipRow}>
          <Button variant="ghost" size="sm" onPress={finish}>
            Skip
          </Button>
        </View>

        <View style={styles.content}>
          {current.tour ? (
            <>
              <View>
                <Text style={[styles.titleCentered, { color: semantic.textHeading }]}>
                  {current.title}
                </Text>
                <Text style={[styles.bodyCenteredMt6, { color: semantic.textMuted }]}>
                  {current.body}
                </Text>
              </View>
              <View style={styles.featureList}>
                {FEATURES.map((f) => (
                  <View
                    key={f.label}
                    style={[styles.featureRow, { backgroundColor: colors.warm[100] }]}
                  >
                    <View style={[styles.featureIcon, { backgroundColor: semantic.surfaceCard }]}>
                      <Icon name={f.icon} size={14} color={colors.clay[400]} />
                    </View>
                    <View style={styles.flex1}>
                      <Text style={[styles.featureLabel, { color: semantic.textHeading }]}>
                        {f.label}
                      </Text>
                      <Text style={[styles.featureText, { color: semantic.textMuted }]}>
                        {f.text}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <>
              <View style={[styles.stepIcon, { backgroundColor: colors.clay[50] }]}>
                <Icon name={current.icon} size={32} color={colors.clay[400]} />
              </View>
              <View>
                {step === 0 ? (
                  <View style={styles.brandRow}>
                    <Text style={[typography.displayMD, { color: semantic.textHeading }]}>Good</Text>
                    <View
                      style={[
                        styles.brandPill,
                        { backgroundColor: cycleWord === "Dad" ? colors.skyTint : colors.manillaTint },
                      ]}
                    >
                      <Text style={[typography.displayMD, { color: semantic.textHeading }]}>
                        {cycleWord}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <Text style={[styles.titleCentered, { color: semantic.textHeading }]}>
                    {current.title}
                  </Text>
                )}
                <Text style={[styles.bodyCenteredMt4, { color: semantic.textMuted }]}>
                  {current.body}
                </Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.dotsRow}>
          {STEPS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  width: i === step ? 18 : 6,
                  backgroundColor: i === step ? colors.clay[400] : colors.warm[200],
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.footerRow}>
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

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 16, paddingBottom: 24 },
  skipRow: { height: 24, alignItems: "flex-end", justifyContent: "center" },
  content: { flex: 1, alignItems: "center", justifyContent: "center", gap: 6, paddingHorizontal: 2 },
  titleCentered: { ...typography.titleMD, textAlign: "center" },
  bodyCenteredMt6: { ...typography.bodySM, textAlign: "center", marginTop: 6 },
  bodyCenteredMt4: { ...typography.bodySM, textAlign: "center", marginTop: 4 },
  featureList: { gap: 10, width: "100%", marginTop: 2 },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 10,
  },
  featureIcon: { width: 30, height: 30, borderRadius: 999, alignItems: "center", justifyContent: "center" },
  featureLabel: { ...typography.bodySM, fontFamily: fontFamily.bodySemibold },
  featureText: { ...typography.caption, marginTop: 2 },
  stepIcon: { width: 76, height: 76, borderRadius: 999, alignItems: "center", justifyContent: "center" },
  brandRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: 10 },
  brandPill: { borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 },
  dotsRow: { flexDirection: "row", justifyContent: "center", gap: 6, marginBottom: 12 },
  dot: { height: 6, borderRadius: 999 },
  footerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
});
