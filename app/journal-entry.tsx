import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { PhotoSlot } from "@/components/PhotoSlot";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { IconButton } from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { WebContainer } from "@/components/web/WebContainer";
import { useAppData } from "@/lib/app-data";
import { useSemantic } from "@/lib/theme-context";

export default function JournalEntryScreen() {
  const semantic = useSemantic();
  const insets = useSafeAreaInsets();
  const { addJournalEntry } = useAppData();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const canSave = title.trim().length > 0 || body.trim().length > 0;

  const save = () => {
    if (!canSave) return;
    addJournalEntry(title, body, photoUri ?? undefined);
    router.back();
  };

  return (
    <SafeAreaView
      className="flex-1"
      edges={["top", "left", "right"]}
      style={{ backgroundColor: semantic.surfacePage }}
    >
      <WebContainer maxWidth={560} style={{ flex: 1 }}>
        <View className="flex-row items-center justify-between gap-2.5 px-6 pt-6 pb-3">
          <Text className="font-display text-title-sm" style={{ color: semantic.textHeading }}>
            New entry
          </Text>
          <IconButton name="x" label="Close" onPress={() => router.back()} />
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            className="flex-1"
            contentContainerClassName="px-6 pb-3 gap-3"
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            <Field label="Title">
              <Input
                placeholder="A few words"
                value={title}
                onChangeText={setTitle}
                autoFocus
              />
            </Field>

            <PhotoSlot uri={photoUri} onChange={setPhotoUri} height={160} />

            <View className="flex-1">
              <Text className="text-foreground text-sm font-medium mb-1">
                What&apos;s on your mind
              </Text>
              <Textarea
                className="flex-1"
                placeholder="Trips, moments, feelings…"
                value={body}
                onChangeText={setBody}
              />
            </View>
          </ScrollView>

          <View
            className="px-6 pt-3 border-t"
            style={{ borderColor: semantic.borderSubtle, paddingBottom: insets.bottom + 32 }}
          >
            <Button variant="primary" fullWidth disabled={!canSave} onPress={save}>
              Save entry
            </Button>
          </View>
        </KeyboardAvoidingView>
      </WebContainer>
    </SafeAreaView>
  );
}
