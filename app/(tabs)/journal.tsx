import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/IconButton";
import { SearchInput } from "@/components/ui/SearchInput";
import { Tag } from "@/components/ui/Tag";
import { useAppData } from "@/lib/app-data";
import { useSemantic } from "@/lib/theme-context";
import type { JournalEntry } from "@/lib/app-data";

function EntryCard({ entry, onPress }: { entry: JournalEntry; onPress: () => void }) {
  const semantic = useSemantic();
  return (
    <Card onPress={onPress}>
      <View className="flex-row justify-between items-baseline">
        <Text className="font-display text-title-sm" style={{ color: semantic.textHeading }}>
          {entry.title}
        </Text>
        <Text className="text-caption" style={{ color: semantic.textSubtle }}>
          {entry.date}
        </Text>
      </View>
      <Text className="font-sans text-body-sm mt-1.5" style={{ color: semantic.textBody }}>
        {entry.body}
      </Text>
      {entry.tags && entry.tags.length > 0 ? (
        <View className="flex-row flex-wrap gap-1.5 mt-1.5">
          {entry.tags.map((tag) => (
            <Tag key={tag} size="sm">
              {tag}
            </Tag>
          ))}
        </View>
      ) : null}
      {entry.photoUris && entry.photoUris.length > 0 ? (
        <View className="flex-row gap-1.5 mt-2.5">
          {entry.photoUris.slice(0, 3).map((uri, index) => {
            const extra = entry.photoUris!.length - 3;
            const isLastVisible = index === 2 && extra > 0;
            return (
              <View key={uri + index} className="flex-1 relative">
                <Image source={{ uri }} className="w-full h-[120px] rounded-[10px]" resizeMode="cover" />
                {isLastVisible ? (
                  <View className="absolute inset-0 rounded-[10px] items-center justify-center bg-black/40">
                    <Text className="font-sans text-body-sm font-medium text-white">+{extra}</Text>
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      ) : null}
    </Card>
  );
}

export default function JournalScreen() {
  const semantic = useSemantic();
  const { state } = useAppData();
  const [search, setSearch] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  // Only tags actually in use — an empty filter chip for a tag no entry carries would be
  // a dead end, not a useful filter.
  const availableTags = useMemo(() => {
    const seen = new Set<string>();
    state.journalEntries.forEach((j) => j.tags?.forEach((t) => seen.add(t)));
    return Array.from(seen).sort((a, b) => a.localeCompare(b));
  }, [state.journalEntries]);

  const toggleActiveTag = (tag: string) =>
    setActiveTags((t) => (t.includes(tag) ? t.filter((x) => x !== tag) : [...t, tag]));

  const entries = state.journalEntries.filter((j) => {
    const matchesSearch =
      !search.trim() || `${j.title} ${j.body}`.toLowerCase().includes(search.toLowerCase());
    const matchesTags = activeTags.length === 0 || activeTags.some((t) => j.tags?.includes(t));
    return matchesSearch && matchesTags;
  });

  const hasEntries = state.journalEntries.length > 0;
  const hasActiveFilter = search.trim().length > 0 || activeTags.length > 0;

  const clearFilters = () => {
    setSearch("");
    setActiveTags([]);
  };

  const openEntry = (id: string) => router.push({ pathname: "/journal-entry", params: { id } });
  const openNewEntry = () => router.push("/journal-entry");

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: semantic.surfacePage }}>
      <ScrollView className="flex-1" contentContainerClassName="px-4 pt-2 pb-28" keyboardShouldPersistTaps="handled">
        <View className="flex-row justify-between items-start">
          <View>
            <Text className="font-display text-display-md" style={{ color: semantic.textHeading }}>
              Journal
            </Text>
            <Text className="font-sans text-body-sm mt-0.5 max-w-[260px]" style={{ color: semantic.textMuted }}>
              Your experience of parenthood. Not a report card.
            </Text>
          </View>
          <IconButton name="plus" label="New entry" variant="secondary" onPress={openNewEntry} />
        </View>

        <View className="mt-5">
          <SearchInput placeholder="Search journal" value={search} onChangeText={setSearch} />
        </View>

        {availableTags.length > 0 ? (
          <View className="flex-row flex-wrap gap-2 mt-3">
            {availableTags.map((tag) => (
              <Tag key={tag} selected={activeTags.includes(tag)} onPress={() => toggleActiveTag(tag)}>
                {tag}
              </Tag>
            ))}
          </View>
        ) : null}

        <View className="mt-4 gap-2.5">
          {entries.length === 0 ? (
            <View className="items-center px-6 py-14">
              <View
                className="w-14 h-14 rounded-full items-center justify-center mb-3"
                style={{ backgroundColor: semantic.surfaceSunken }}
              >
                <Icon name="pencil" size={22} color={semantic.textAccent} />
              </View>
              <Text className="font-display text-title-sm text-center" style={{ color: semantic.textHeading }}>
                {hasEntries ? "No entries match" : "Nothing here yet"}
              </Text>
              <Text
                className="font-sans text-body-sm text-center mt-1 max-w-[280px]"
                style={{ color: semantic.textMuted }}
              >
                {hasEntries
                  ? "Try a different search, or clear your filters."
                  : "Your first entry is a start. Write about today, whenever you're ready."}
              </Text>
              {hasActiveFilter ? (
                <Pressable onPress={clearFilters} className="flex-row items-center gap-1 mt-3 py-1">
                  <Text className="font-sans-medium text-body-sm" style={{ color: semantic.textAccent }}>
                    Clear search and filters
                  </Text>
                </Pressable>
              ) : null}
            </View>
          ) : (
            entries.map((j) => <EntryCard key={j.id} entry={j} onPress={() => openEntry(j.id)} />)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
