import "../global.css";

import {
  Fraunces_400Regular,
  Fraunces_600SemiBold,
  Fraunces_700Bold,
} from "@expo-google-fonts/fraunces";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { ClerkProvider, useAuth } from "@clerk/expo";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppDataProvider } from "@/lib/app-data";
import { clerkTokenCache } from "@/lib/clerk-token-cache";
import { convex } from "@/lib/convex";
import { semantic, spacing, typography } from "@/lib/theme";
import { ThemeProvider, useColorSchemeValue } from "@/lib/theme-context";
import { ToastProvider } from "@/lib/toast";

function ThemedStatusBar() {
  const scheme = useColorSchemeValue();
  return <StatusBar style={scheme === "dark" ? "light" : "dark"} />;
}

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Fraunces_400Regular,
    Fraunces_600SemiBold,
    Fraunces_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  if (!publishableKey) {
    return (
      <View style={[styles.missingConfig, { backgroundColor: semantic.surfacePage }]}>
        <Text style={[typography.titleMD, { color: semantic.textHeading }]}>
          Missing Clerk configuration
        </Text>
        <Text style={[typography.bodyMD, styles.missingConfigBody, { color: semantic.textMuted }]}>
          Set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY (and EXPO_PUBLIC_CONVEX_URL,
          EXPO_PUBLIC_CLERK_ISSUER_URL) in .env.local — see .env.example.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ClerkProvider publishableKey={publishableKey} tokenCache={clerkTokenCache}>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <AppDataProvider>
            <ThemeProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <ToastProvider>
                  <ThemedStatusBar />
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="auth" />
                    <Stack.Screen name="profile-setup" />
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="checkin" options={{ presentation: "modal" }} />
                    <Stack.Screen name="journal-entry" options={{ presentation: "modal" }} />
                    <Stack.Screen name="affirmation" options={{ presentation: "modal" }} />
                    <Stack.Screen name="milestones" options={{ presentation: "modal" }} />
                    <Stack.Screen name="burn" options={{ presentation: "modal" }} />
                    <Stack.Screen name="panic" options={{ presentation: "modal" }} />
                    <Stack.Screen name="account" options={{ presentation: "modal" }} />
                    <Stack.Screen name="recap" options={{ presentation: "modal" }} />
                  </Stack>
                </ToastProvider>
              </GestureHandlerRootView>
            </ThemeProvider>
          </AppDataProvider>
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  missingConfig: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing[8],
    gap: spacing[2],
  },
  missingConfigBody: {
    textAlign: "center",
  },
});
