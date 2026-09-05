import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { PhotoGrid } from "@/components/PhotoSlot";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { IconButton } from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";
import { TagPicker } from "@/components/ui/TagPicker";
import { Textarea } from "@/components/ui/Textarea";
import { WebContainer } from "@/components/web/WebContainer";
import { JOURNAL_DEFAULT_TAGS, useAppData } from "@/lib/app-data";
import { useSemantic } from "@/lib/theme-context";

export default function JournalEntryScreen() {
  const semantic = useSemantic();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { state, addJournalEntry, updateJournalEntry, addCustomJournalTag } = useAppData();
  const existingEntry = id ? state.journalEntries.find((e) => e.id === id) : undefined;
  const isEditing = existingEntry !== undefined;

  const [title, setTitle] = useState(existingEntry?.title ?? "");
  const [body, setBody] = useState(existingEntry?.body ?? "");
  const [photoUris, setPhotoUris] = useState<string[]>(existingEntry?.photoUris ?? []);
  const [tags, setTags] = useState<string[]>(existingEntry?.tags ?? []);

  const allTags = useMemo(
    () => Array.from(new Set([...JOURNAL_DEFAULT_TAGS, ...state.journalCustomTags])),
    [state.journalCustomTags],
  );

  const toggleTag = (tag: string) =>
    setTags((t) => (t.includes(tag) ? t.filter((x) => x !== tag) : [...t, tag]));

  const canSave = title.trim().length > 0 || body.trim().length > 0;

  const save = () => {
    if (!canSave) return;
    const savedPhotoUris = photoUris.length > 0 ? photoUris : undefined;
    const savedTags = tags.length > 0 ? tags : undefined;
    if (isEditing) {
      updateJournalEntry(existingEntry.id, title, body, savedPhotoUris, savedTags);
    } else {
      addJournalEntry(title, body, savedPhotoUris, savedTags);
    }
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
            {isEditing ? "Edit entry" : "New entry"}
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
                autoFocus={!isEditing}
              />
            </Field>

            <PhotoGrid uris={photoUris} onChange={setPhotoUris} />

            <View>
              <Text className="text-foreground text-sm font-medium mb-1">Tags</Text>
              <TagPicker
                allTags={allTags}
                selected={tags}
                onToggle={toggleTag}
                onAddCustomTag={addCustomJournalTag}
              />
            </View>

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
              {isEditing ? "Save changes" : "Save entry"}
            </Button>
          </View>
        </KeyboardAvoidingView>
      </WebContainer>
    </SafeAreaView>
  );
}
