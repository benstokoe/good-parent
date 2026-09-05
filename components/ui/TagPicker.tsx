import type { TriggerRef } from "@rn-primitives/popover";
import { useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/Input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { Tag } from "@/components/ui/Tag";
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
  const [draft, setDraft] = useState("");
  const triggerRef = useRef<TriggerRef>(null);

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
    triggerRef.current?.close();
  };

  return (
    <View className="gap-2.5">
      <View className="flex-row flex-wrap gap-2 items-center">
        {visible.map((tag) => (
          <Tag key={tag} selected={selected.includes(tag)} onPress={() => onToggle(tag)}>
            {tag}
          </Tag>
        ))}
        {!expanded && allTags.length > visible.length ? (
          <Pressable
            onPress={() => setExpanded(true)}
            className="flex-row items-center justify-center rounded-full border px-3.5 py-3"
            style={{ borderColor: semantic.borderDefault }}
          >
            <Text className="font-sans text-sm font-medium" style={{ color: semantic.textMuted }}>
              See all
            </Text>
          </Pressable>
        ) : null}

        <Popover>
          <PopoverTrigger ref={triggerRef} asChild>
            <Pressable
              accessibilityLabel="Add a custom tag"
              accessibilityRole="button"
              className="w-11 h-11 rounded-full items-center justify-center"
              style={{ backgroundColor: semantic.surfaceSunken }}
            >
              <Icon name="plus" size={18} color={semantic.textHeading} />
            </Pressable>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <View className="flex-row gap-2 items-center">
              <Input
                autoFocus
                className="flex-1"
                placeholder="Add a custom tag"
                value={draft}
                onChangeText={setDraft}
                onSubmitEditing={submitCustomTag}
                returnKeyType="done"
              />
              <Pressable
                onPress={submitCustomTag}
                disabled={!draft.trim()}
                accessibilityLabel="Add tag"
                accessibilityRole="button"
                className="w-11 h-11 rounded-full items-center justify-center"
                style={{
                  backgroundColor: semantic.surfaceSunken,
                  opacity: draft.trim() ? 1 : 0.5,
                }}
              >
                <Icon name="plus" size={18} color={semantic.textHeading} />
              </Pressable>
            </View>
          </PopoverContent>
        </Popover>
      </View>
    </View>
  );
}
