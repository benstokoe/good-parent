import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card } from "@/components/ui/Card";
import { IconButton } from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";
import { Tag } from "@/components/ui/Tag";
import { WebContainer } from "@/components/web/WebContainer";
import { WebGrid } from "@/components/web/WebGrid";
import { useAppData } from "@/lib/app-data";
import { useSemantic } from "@/lib/theme-context";

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

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: semantic.surfacePage }}>
      <ScrollView className="flex-1" contentContainerClassName="px-4 pt-2 pb-28">
        <WebContainer maxWidth={880}>
          <View className="flex-row justify-between items-start">
            <View>
              <Text className="font-display text-display-md" style={{ color: semantic.textHeading }}>
                Journal
              </Text>
              <Text
                className="font-sans text-body-sm mt-0.5 max-w-[260px]"
                style={{ color: semantic.textMuted }}
              >
                Your experience of parenthood. Not a report card.
              </Text>
            </View>
            <IconButton
              name="plus"
              label="New entry"
              variant="secondary"
              onPress={() => router.push("/journal-entry")}
            />
          </View>

          <View className="mt-2">
            <Input placeholder="Search journal" value={search} onChangeText={setSearch} />
          </View>

          {availableTags.length > 0 ? (
            <View className="flex-row flex-wrap gap-2 mt-2">
              {availableTags.map((tag) => (
                <Tag key={tag} selected={activeTags.includes(tag)} onPress={() => toggleActiveTag(tag)}>
                  {tag}
                </Tag>
              ))}
            </View>
          ) : null}

          <View className="mt-1.5">
            <WebGrid columns={2}>
              {entries.map((j) => (
                <Card key={j.id} onPress={() => router.push({ pathname: "/journal-entry", params: { id: j.id } })}>
                  <View className="flex-row justify-between items-baseline">
                    <Text className="font-display text-title-sm" style={{ fontSize: 15, color: semantic.textHeading }}>
                      {j.title}
                    </Text>
                    <Text className="text-caption" style={{ color: semantic.textSubtle }}>
                      {j.date}
                    </Text>
                  </View>
                  <Text className="font-sans text-body-sm mt-1.5" style={{ color: semantic.textBody }}>
                    {j.body}
                  </Text>
                  {j.tags && j.tags.length > 0 ? (
                    <View className="flex-row flex-wrap gap-1.5 mt-1.5">
                      {j.tags.map((tag) => (
                        <View
                          key={tag}
                          className="rounded-full px-2.5 py-0.5"
                          style={{ backgroundColor: semantic.surfaceSunken }}
                        >
                          <Text className="font-sans text-caption" style={{ color: semantic.textMuted }}>
                            {tag}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ) : null}
                  {j.photoUris && j.photoUris.length > 0 ? (
                    <View className="flex-row gap-1.5 mt-2.5">
                      {j.photoUris.slice(0, 3).map((uri, index) => {
                        const extra = j.photoUris!.length - 3;
                        const isLastVisible = index === 2 && extra > 0;
                        return (
                          <View key={uri + index} className="flex-1 relative">
                            <Image
                              source={{ uri }}
                              className="w-full h-[120px] rounded-[10px]"
                              resizeMode="cover"
                            />
                            {isLastVisible ? (
                              <View className="absolute inset-0 rounded-[10px] items-center justify-center bg-black/40">
                                <Text className="font-sans text-body-sm font-medium text-white">
                                  +{extra}
                                </Text>
                              </View>
                            ) : null}
                          </View>
                        );
                      })}
                    </View>
                  ) : null}
                </Card>
              ))}
            </WebGrid>
          </View>
        </WebContainer>
      </ScrollView>
    </SafeAreaView>
  );
}
