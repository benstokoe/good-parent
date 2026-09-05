import type { TriggerRef } from "@rn-primitives/popover";
import { useRef, useState } from "react";
import { View } from "react-native";

import { IconButton } from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { Tag } from "@/components/ui/Tag";

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
          <Tag onPress={() => setExpanded(true)}>See all</Tag>
        ) : null}

        <Popover>
          <PopoverTrigger ref={triggerRef} asChild>
            <IconButton name="plus" label="Add a custom tag" variant="sunken" />
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
              <IconButton
                name="plus"
                label="Add tag"
                variant="sunken"
                disabled={!draft.trim()}
                onPress={submitCustomTag}
              />
            </View>
          </PopoverContent>
        </Popover>
      </View>
    </View>
  );
}
