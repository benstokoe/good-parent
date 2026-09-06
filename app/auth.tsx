import { useSignIn, useSignUp, useSSO } from "@clerk/expo";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";
import Svg, { Path } from "react-native-svg";

import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Tabs } from "@/components/ui/Tabs";
import { fontFamily, typography } from "@/lib/theme";
import { useSemantic } from "@/lib/theme-context";

WebBrowser.maybeCompleteAuthSession();

function AppleLogo() {
  return (
    <Svg viewBox="0 0 384 512" width={16} height={16}>
      <Path
        fill="currentColor"
        d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c-19.6-23.1-17.6-53-15.7-58.5-24.7 1.5-53.3 17-70.3 37.2-15.6 18.5-27.9 47.6-24.6 74.6 27.6 2.1 55.7-14.5 74.6-37.3z"
      />
    </Svg>
  );
}

function GoogleLogo() {
  return (
    <Svg viewBox="0 0 48 48" width={18} height={18}>
      <Path
        fill="#EA4335"
        d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.4 0 24 0 14.6 0 6.5 5.4 2.6 13.3l7.9 6.1C12.4 13.1 17.7 9.5 24 9.5z"
      />
      <Path
        fill="#4285F4"
        d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.9 7.2l7.6 5.9c4.4-4.1 7.1-10.1 7.1-17.6z"
      />
      <Path
        fill="#FBBC05"
        d="M10.5 28.6c-.6-1.7-.9-3.5-.9-5.4s.3-3.7.9-5.4l-7.9-6.1C1 15.1 0 19 0 23.2s1 8.1 2.6 11.5l7.9-6.1z"
      />
      <Path
        fill="#34A853"
        d="M24 47c6.4 0 11.8-2.1 15.7-5.7l-7.6-5.9c-2.1 1.5-5 2.4-8.1 2.4-6.3 0-11.6-3.6-13.5-8.8l-7.9 6.1C6.5 41.6 14.6 47 24 47z"
      />
    </Svg>
  );
}

function OAuthButton({
  children,
  onPress,
}: {
  children: React.ReactNode;
  onPress: () => void;
}) {
  const semantic = useSemantic();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.oauthButton,
        { backgroundColor: semantic.actionSecondary, borderColor: semantic.borderDefault },
      ]}
    >
      {children}
    </Pressable>
  );
}

type Mode = "signup" | "login";

export default function AuthScreen() {
  const semantic = useSemantic();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyStep, setVerifyStep] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const { startSSOFlow } = useSSO();

  const goNext = () => router.replace("/profile-setup");

  const submitOAuth = async (strategy: "oauth_apple" | "oauth_google") => {
    setError(null);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({ strategy });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        goNext();
      }
    } catch (e: any) {
      setError(e?.errors?.[0]?.message ?? "Couldn't complete that sign-in. Please try again.");
    }
  };

  const submit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      if (mode === "login") {
        const { error: passwordError } = await signIn.password({ identifier: email, password });
        if (passwordError) {
          setError(passwordError.message ?? "Couldn't complete sign in. Please try again.");
          return;
        }
        const { error: finalizeError } = await signIn.finalize();
        if (finalizeError) {
          setError(finalizeError.message ?? "Couldn't complete sign in. Please try again.");
          return;
        }
        goNext();
      } else {
        const { error: passwordError } = await signUp.password({ emailAddress: email, password });
        if (passwordError) {
          setError(passwordError.message ?? "Something went wrong. Please try again.");
          return;
        }
        const { error: sendError } = await signUp.verifications.sendEmailCode();
        if (sendError) {
          setError(sendError.message ?? "Couldn't send a verification code. Please try again.");
          return;
        }
        setVerifyStep(true);
      }
    } catch (e: any) {
      setError(e?.errors?.[0]?.message ?? "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const submitVerification = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const { error: verifyError } = await signUp.verifications.verifyEmailCode({ code });
      if (verifyError) {
        setError(verifyError.message ?? "That code didn't work. Please try again.");
        return;
      }
      const { error: finalizeError } = await signUp.finalize();
      if (finalizeError) {
        setError(finalizeError.message ?? "Something went wrong. Please try again.");
        return;
      }
      goNext();
    } catch (e: any) {
      setError(e?.errors?.[0]?.message ?? "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (verifyStep) {
    return (
      <SafeAreaView style={[styles.flex1, { backgroundColor: semantic.surfacePage }]}>
        <View style={styles.verifyContainer}>
          <View>
            <Text style={[typography.titleMD, { color: semantic.textHeading }]}>Check your email</Text>
            <Text style={[styles.bodySmMt2, { color: semantic.textMuted }]}>
              Enter the code we sent to {email}.
            </Text>
          </View>
          <Field label="Verification code">
            <Input
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              placeholder="123456"
            />
          </Field>
          {error ? <Text style={[typography.bodySM, { color: semantic.textAccent }]}>{error}</Text> : null}
          <Button variant="primary" size="lg" fullWidth loading={submitting} onPress={submitVerification}>
            Verify
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.flex1, { backgroundColor: semantic.surfacePage }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[typography.titleMD, { color: semantic.textHeading }]}>GoodParent</Text>
          <Text style={[styles.bodySmMt2, { color: semantic.textMuted }]}>
            {mode === "login" ? "Welcome back." : "Create your private account."}
          </Text>
        </View>

        <View style={styles.form}>
          <Tabs
            items={[
              { value: "login", label: "Log in" },
              { value: "signup", label: "Sign up" },
            ]}
            value={mode}
            onChange={(v) => setMode(v as Mode)}
          />

          <View style={styles.oauthGroup}>
            <OAuthButton onPress={() => submitOAuth("oauth_apple")}>
              <AppleLogo />
              <Text style={[styles.bodyMdMedium, { color: semantic.textBody }]}>
                Continue with Apple
              </Text>
            </OAuthButton>
            <OAuthButton onPress={() => submitOAuth("oauth_google")}>
              <GoogleLogo />
              <Text style={[styles.bodyMdMedium, { color: semantic.textBody }]}>
                Continue with Google
              </Text>
            </OAuthButton>
          </View>

          <View style={styles.dividerRow}>
            <View style={[styles.dividerLine, { backgroundColor: semantic.borderSubtle }]} />
            <Text style={[styles.captionTracked, { color: semantic.textSubtle }]}>OR</Text>
            <View style={[styles.dividerLine, { backgroundColor: semantic.borderSubtle }]} />
          </View>

          <View style={styles.fields}>
            <Field label="Email">
              <Input
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="you@example.com"
              />
            </Field>
            <Field label="Password">
              <Input
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="••••••••"
              />
            </Field>
          </View>

          {error ? <Text style={[typography.bodySM, { color: semantic.textAccent }]}>{error}</Text> : null}

          <Button variant="primary" size="lg" fullWidth loading={submitting} onPress={submit}>
            {mode === "login" ? "Log in" : "Create account"}
          </Button>
        </View>

        <View style={styles.footer}>
          <Text style={[typography.caption, { color: semantic.textMuted }]}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <Text
              style={[styles.captionMedium, { color: semantic.textLink }]}
              onPress={() => setMode(mode === "login" ? "signup" : "login")}
            >
              {mode === "login" ? "Sign up" : "Log in"}
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  oauthButton: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  verifyContainer: { flex: 1, paddingHorizontal: 16, paddingTop: 64, gap: 16 },
  container: { flex: 1, alignItems: "center", paddingHorizontal: 16, paddingTop: 64, paddingBottom: 24 },
  header: { alignItems: "center", marginBottom: 16 },
  form: { width: "100%", maxWidth: 320, gap: 16 },
  bodySmMt2: { ...typography.bodySM, marginTop: 2 },
  bodyMdMedium: { ...typography.bodyMD, fontFamily: fontFamily.bodyMedium },
  oauthGroup: { gap: 10 },
  dividerRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  dividerLine: { flex: 1, height: 1 },
  captionTracked: { ...typography.caption, letterSpacing: 0.3 },
  fields: { gap: 8 },
  footer: { marginTop: 8 },
  captionMedium: { ...typography.caption, fontFamily: fontFamily.bodyMedium },
});
