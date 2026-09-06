import { useRef, useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, View } from "react-native";

import { IconButton } from "@/components/ui/IconButton";
import { Input, type TextInputRef } from "@/components/ui/Input";
import { Tag } from "@/components/ui/Tag";
import { radius, shadows, spacing } from "@/lib/theme";
import { useSemantic } from "@/lib/theme-context";

// Roughly two rows' worth on a mobile-width screen — an approximation, since actual
// row count depends on label length and screen width, not something worth measuring for.
const COMMON_TAG_COUNT = 6;

export function TagPicker({
  allTags,
  selected,
  onToggle,
  onAddCustomTag,
}: {
  allTags: string[];
  selected: string[];
  onToggle: (tag: string) => void;
  onAddCustomTag: (tag: string) => void;
}) {
  const semantic = useSemantic();
  const [expanded, setExpanded] = useState(false);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const draftInputRef = useRef<TextInputRef>(null);

  const commonTags = allTags.slice(0, COMMON_TAG_COUNT);
  // A tag the entry already carries stays visible even if collapsed view would hide it —
  // a selection should never disappear just because "See all" hasn't been tapped.
  const visible = expanded
    ? allTags
    : Array.from(new Set([...commonTags, ...selected.filter((t) => allTags.includes(t))]));

  const submitCustomTag = () => {
    const value = draft.trim();
    if (!value) return;
    onAddCustomTag(value);
    onToggle(value);
    setDraft("");
    draftInputRef.current?.clear();
    setAdding(false);
  };

  return (
    <View style={{ gap: spacing[4] }}>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing[3], alignItems: "center" }}>
        {visible.map((tag) => (
          <Tag key={tag} selected={selected.includes(tag)} onPress={() => onToggle(tag)}>
            {tag}
          </Tag>
        ))}
        {!expanded && allTags.length > visible.length ? (
          <Tag onPress={() => setExpanded(true)}>See all</Tag>
        ) : null}

        <IconButton name="plus" label="Add a custom tag" variant="sunken" onPress={() => setAdding(true)} />
      </View>

      {/* Plain RN Modal, not @expo/ui's universal BottomSheet — see the note in
          components/ui/Dialog.tsx: BottomSheet doesn't reliably deliver touches to
          plain Pressable children (this popup's "Add tag" button). */}
      <Modal visible={adding} transparent animationType="fade" onRequestClose={() => setAdding(false)}>
        <View style={{ flex: 1 }}>
          <Pressable
            style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0,0,0,0.5)" }]}
            onPress={() => setAdding(false)}
          />
          <KeyboardAvoidingView
            pointerEvents="box-none"
            style={{ flex: 1, justifyContent: "flex-end" }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View
              style={[
                {
                  flexDirection: "row",
                  gap: spacing[3],
                  alignItems: "center",
                  padding: spacing[6],
                  borderTopLeftRadius: radius.lg,
                  borderTopRightRadius: radius.lg,
                  backgroundColor: semantic.surfaceCard,
                },
                shadows.overlay,
              ]}
            >
              <Input
                ref={draftInputRef}
                autoFocus
                style={{ flex: 1 }}
                placeholder="Add a custom tag"
                value={draft}
                onChangeText={setDraft}
                onSubmitEditing={submitCustomTag}
                returnKeyType="done"
              />
              <IconButton
                name="plus"
                label="Add tag"
                variant="sunken"
                disabled={!draft.trim()}
                onPress={submitCustomTag}
              />
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}
