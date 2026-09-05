import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";

import { PhotoGrid } from "@/components/PhotoSlot";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { IconButton } from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";
import { TagPicker } from "@/components/ui/TagPicker";
import { Textarea } from "@/components/ui/Textarea";
import { JOURNAL_DEFAULT_TAGS, useAppData } from "@/lib/app-data";
import { useSemantic } from "@/lib/theme-context";
import { useToast } from "@/lib/toast";

// Imperative escape hatch for hosts that can navigate a user away from a dirty form through
// a path other than the Close button — e.g. the wide-web detail pane switching to a
// different entry. `requestNavigateAway` runs the same dirty-check/confirm Close uses, then
// calls `proceed` (never blocks quietly): the form's Close button also routes through this
// so there is exactly one place the discard guard lives.
export type JournalEntryFormHandle = {
  requestNavigateAway: (proceed: () => void) => void;
};

// The Journal create/edit form, shared between the mobile modal route (app/journal-entry.tsx)
// and the wide-web detail pane (app/(tabs)/journal.tsx) — same fields, save/discard behavior,
// and copy either way; only the surrounding chrome (SafeAreaView, centering, insets) differs
// per host, which is why this component owns none of that.
export const JournalEntryForm = forwardRef<
  JournalEntryFormHandle,
  { id?: string; onClose: () => void; bottomInset?: number }
>(function JournalEntryForm({ id, onClose, bottomInset = 0 }, ref) {
  const semantic = useSemantic();
  const { showToast } = useToast();
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

  const isDirty = isEditing
    ? title !== (existingEntry.title ?? "") ||
      body !== (existingEntry.body ?? "") ||
      JSON.stringify(photoUris) !== JSON.stringify(existingEntry.photoUris ?? []) ||
      JSON.stringify(tags) !== JSON.stringify(existingEntry.tags ?? [])
    : title.trim().length > 0 || body.trim().length > 0 || photoUris.length > 0 || tags.length > 0;

  const requestNavigateAway = (proceed: () => void) => {
    if (!isDirty) {
      proceed();
      return;
    }
    Alert.alert("Discard this entry?", "What you've written won't be saved.", [
      { text: "Keep writing", style: "cancel" },
      { text: "Discard entry", style: "destructive", onPress: proceed },
    ]);
  };

  useImperativeHandle(ref, () => ({ requestNavigateAway }));

  const close = () => requestNavigateAway(onClose);

  const save = () => {
    if (!canSave) return;
    const savedPhotoUris = photoUris.length > 0 ? photoUris : undefined;
    const savedTags = tags.length > 0 ? tags : undefined;
    if (isEditing) {
      updateJournalEntry(existingEntry.id, title, body, savedPhotoUris, savedTags);
    } else {
      addJournalEntry(title, body, savedPhotoUris, savedTags);
    }
    showToast(isEditing ? "Entry updated." : "Entry saved.");
    onClose();
  };

  return (
    <View className="flex-1">
      <View className="flex-row items-center justify-between gap-2.5 px-6 pt-6 pb-3">
        <Text className="font-display text-title-sm" style={{ color: semantic.textHeading }}>
          {isEditing ? "Edit entry" : "New entry"}
        </Text>
        <IconButton name="x" label="Close" onPress={close} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 pb-3 gap-3"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <Field label="Title">
            <Input placeholder="A few words" value={title} onChangeText={setTitle} />
          </Field>

          <Field label="What's on your mind" className="flex-1">
            <Textarea
              className="flex-1"
              placeholder="Trips, moments, feelings…"
              value={body}
              onChangeText={setBody}
              autoFocus={!isEditing}
            />
          </Field>

          <PhotoGrid uris={photoUris} onChange={setPhotoUris} />

          <Field label="Tags">
            <TagPicker
              allTags={allTags}
              selected={tags}
              onToggle={toggleTag}
              onAddCustomTag={addCustomJournalTag}
            />
          </Field>
        </ScrollView>

        <View
          className="px-6 pt-3 border-t"
          style={{ borderColor: semantic.borderSubtle, paddingBottom: bottomInset + 32 }}
        >
          <Button variant="primary" fullWidth disabled={!canSave} onPress={save}>
            {isEditing ? "Save changes" : "Save entry"}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
});
