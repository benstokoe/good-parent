import * as LocalAuthentication from "expo-local-authentication";
import { useEffect } from "react";
import { Platform, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/icon";
import { useAppData } from "@/lib/app-data";
import { colors } from "@/lib/theme";

// Biometric app-lock, layered on top of (not instead of) Clerk sign-in — mobile only,
// per CLAUDE.md. `lockUnlocked` lives in AppDataProvider and resets on app relaunch, so
// this gate re-appears every cold start while appLockEnabled is on.
export function LockGate({ children }: { children: React.ReactNode }) {
  const { state, unlockApp } = useAppData();

  const locked = Platform.OS !== "web" && state.settings.appLockEnabled && !state.lockUnlocked;

  const authenticate = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!hasHardware || !isEnrolled) {
      // No biometrics configured on this device/simulator — don't hard-lock the user out.
      unlockApp();
      return;
    }
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Unlock GoodParent",
    });
    if (result.success) unlockApp();
  };

  useEffect(() => {
    if (locked) authenticate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!locked) return <>{children}</>;

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.warm[900] }}>
      <View className="flex-1 items-center justify-center px-6 gap-1">
        <View
          className="w-16 h-16 rounded-full items-center justify-center mb-5"
          style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
        >
          <Icon name="lock" size={26} color="#fff" />
        </View>
        <Text className="font-display text-title-sm" style={{ color: "#fff" }}>
          GoodParent is locked
        </Text>
        <Text
          className="font-sans text-body-sm text-center mt-1.5"
          style={{ color: colors.warm[300] }}
        >
          Your check-ins and journal stay private.
        </Text>
        <View className="mt-7 w-[200px]">
          <Button variant="primary" size="lg" fullWidth onPress={authenticate}>
            Use Face ID
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
