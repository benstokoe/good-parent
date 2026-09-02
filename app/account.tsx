import * as LocalAuthentication from "expo-local-authentication";
import { useAuth } from "@clerk/expo";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, Platform, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { Tabs } from "@/components/ui/Tabs";
import { AFFIRMATIONS } from "@/lib/affirmations";
import { useAppData } from "@/lib/app-data";
import { colors, semantic } from "@/lib/theme";

const REMINDER_FREQUENCY_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "weekdays", label: "Weekdays" },
  { value: "few", label: "A few a week" },
];

const RECAP_CADENCE_OPTIONS = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

function heatmapColor(seed: number) {
  return (seed * 37 + 11) % 100 > 30 ? colors.clay[400] : colors.warm[200];
}

export default function AccountScreen() {
  const { state, updateSettings } = useAppData();
  const { signOut } = useAuth();
  const [exportState, setExportState] = useState<"idle" | "preparing" | "done">("idle");

  const roleLabel =
    state.profile.role === "mum" ? "Mum" : state.profile.role === "dad" ? "Dad" : state.profile.role === "parent" ? "Parent" : "Your profile";
  const subtitle = state.profile.childCount
    ? `${state.profile.childCount} ${state.profile.childCount === "1" ? "child" : "children"}`
    : "Tell us about yourself in setup";

  const weeks = useMemo(() => Array.from({ length: 26 }, (_, w) => w), []);

  const startExport = () => {
    setExportState("preparing");
    setTimeout(() => setExportState("done"), 1200);
  };

  const toggleAppLock = async (value: boolean) => {
    if (value && Platform.OS !== "web") {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!hasHardware || !isEnrolled) {
        Alert.alert("Face ID not set up", "Set up Face ID or a passcode on this device first.");
        return;
      }
    }
    updateSettings({ appLockEnabled: value });
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: semantic.surfacePage }}>
      <View className="flex-row items-center gap-2.5 px-6 pb-3">
        <IconButton name="x" label="Close" onPress={() => router.back()} />
        <Text className="font-display text-title-sm" style={{ color: semantic.textHeading }}>
          Account
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-2" contentContainerClassName="pb-6">
        <Card tone="sunken">
          <View className="flex-row items-center gap-3">
            <View
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.clay[100] }}
            >
              <Icon name="user" size={18} color={colors.clay[400]} />
            </View>
            <View>
              <Text className="font-display" style={{ fontSize: 15, color: semantic.textHeading }}>
                {roleLabel}
              </Text>
              <Text className="font-sans text-caption mt-0.5" style={{ color: semantic.textMuted }}>
                {subtitle}
              </Text>
            </View>
          </View>
        </Card>

        <SectionLabel>Check-in streak</SectionLabel>
        <Card style={{ marginTop: 0 }}>
          <View className="flex-row items-center justify-between mb-2.5">
            <Badge tone="accent" dot>
              4-day check-in streak
            </Badge>
            <Text className="text-caption" style={{ color: semantic.textSubtle }}>
              Last 6 months
            </Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-[3px]">
              {weeks.map((w) => (
                <View key={w} className="gap-[3px]">
                  {Array.from({ length: 7 }, (_, d) => (
                    <View
                      key={d}
                      className="w-[8px] h-[8px] rounded-[2px]"
                      style={{ backgroundColor: heatmapColor(w * 7 + d) }}
                    />
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
        </Card>

        <SectionLabel>Privacy</SectionLabel>
        <Card style={{ marginTop: 0 }}>
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="font-sans-semibold text-body-md" style={{ color: semantic.textHeading }}>
                App lock
              </Text>
              <Text className="font-sans text-caption mt-0.5" style={{ color: semantic.textMuted }}>
                Require Face ID to open GoodParent.
              </Text>
            </View>
            <Switch checked={state.settings.appLockEnabled} onChange={toggleAppLock} />
          </View>
        </Card>

        <SectionLabel>Your data</SectionLabel>
        <Card style={{ marginTop: 0 }}>
          <View className="flex-row items-center justify-between gap-3">
            <Text className="font-sans text-body-sm flex-1" style={{ color: semantic.textBody }}>
              Download everything you&apos;ve written — check-ins, journal, milestones.
            </Text>
            {exportState === "idle" ? (
              <Button variant="secondary" size="sm" onPress={startExport}>
                Export
              </Button>
            ) : exportState === "preparing" ? (
              <Text className="text-body-sm" style={{ color: semantic.textMuted }}>
                Preparing…
              </Text>
            ) : (
              <Text className="text-body-sm" style={{ color: colors.green }}>
                Downloaded
              </Text>
            )}
          </View>
        </Card>

        <SectionLabel>Reminders</SectionLabel>
        <Card style={{ marginTop: 0 }}>
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="font-sans-semibold text-body-md" style={{ color: semantic.textHeading }}>
                Daily check-in nudge
              </Text>
              <Text className="font-sans text-caption mt-0.5" style={{ color: semantic.textMuted }}>
                A gentle reminder, not a scoreboard.
              </Text>
            </View>
            <Switch
              checked={state.settings.reminderEnabled}
              onChange={(v) => updateSettings({ reminderEnabled: v })}
            />
          </View>
          {state.settings.reminderEnabled ? (
            <View className="gap-3 mt-4">
              <Field label="Time">
                <Input
                  value={state.settings.reminderTime}
                  onChangeText={(v) => updateSettings({ reminderTime: v })}
                  placeholder="20:00"
                />
              </Field>
              <Tabs
                items={REMINDER_FREQUENCY_OPTIONS}
                value={state.settings.reminderFrequency}
                onChange={(v) => updateSettings({ reminderFrequency: v as any })}
              />
            </View>
          ) : null}
        </Card>

        <SectionLabel>Recap</SectionLabel>
        <Card style={{ marginTop: 0 }}>
          <Text
            className="font-sans-semibold text-body-md mb-2.5"
            style={{ color: semantic.textHeading }}
          >
            How often should we recap?
          </Text>
          <Tabs
            items={RECAP_CADENCE_OPTIONS}
            value={state.settings.recapCadence}
            onChange={(v) => updateSettings({ recapCadence: v as any })}
          />
        </Card>

        <SectionLabel>Lock screen widget</SectionLabel>
        <View
          className="rounded-[20px] px-4 py-7 items-center"
          style={{ backgroundColor: colors.warm[900] }}
        >
          <Text className="text-caption" style={{ color: colors.warm[300] }}>
            9:41
          </Text>
          <View
            className="w-16 h-px my-3"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
          />
          <View
            className="rounded-[14px] px-4 py-3 max-w-[220px]"
            style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
          >
            <View className="flex-row items-center justify-center gap-1.5 mb-1">
              <Icon name="sparkles" size={12} color={colors.clay[200]} />
              <Text className="text-[9px] tracking-wide uppercase" style={{ color: colors.warm[300] }}>
                GoodParent
              </Text>
            </View>
            <Text className="text-caption text-center" style={{ color: "#fff" }}>
              {AFFIRMATIONS[0]}
            </Text>
          </View>
        </View>
        <Text
          className="font-sans text-caption text-center mt-2.5"
          style={{ color: semantic.textMuted }}
        >
          A rotating affirmation, without opening the app.
        </Text>

        <View className="mt-7">
          <Button
            variant="ghost"
            fullWidth
            onPress={async () => {
              await signOut();
              router.replace("/auth");
            }}
          >
            Sign out
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <Text
      className="text-caption tracking-wide uppercase mt-6 mb-3"
      style={{ color: semantic.textSubtle }}
    >
      {children}
    </Text>
  );
}
