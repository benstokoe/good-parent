import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Tabs } from "@/components/ui/Tabs";
import { WebContainer } from "@/components/web/WebContainer";
import { WebGrid } from "@/components/web/WebGrid";
import { useAppData } from "@/lib/app-data";
import { semantic } from "@/lib/theme";

export default function GrowthScreen() {
  const { state, resolveActionItem } = useAppData();
  const [tab, setTab] = useState<"open" | "resolved">("open");

  const compareThen = state.checkins[2];
  const compareNow = state.checkins[0];

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: semantic.surfacePage }}>
      <ScrollView className="flex-1 px-6 pt-16" contentContainerClassName="pb-6">
        <WebContainer maxWidth={880}>
        <Text className="font-display text-display-md" style={{ color: semantic.textHeading }}>
          Growth Space
        </Text>
        <Text className="font-sans text-body-sm mt-0.5" style={{ color: semantic.textMuted }}>
          What&apos;s still a work in progress. Kept apart so the homepage stays about what&apos;s
          going right.
        </Text>

        <View className="mt-4">
          <Card tone="accent">
            <Text
              className="text-caption tracking-wide font-sans-semibold mb-2.5"
              style={{ color: semantic.textAccent }}
            >
              YOU, THEN AND NOW
            </Text>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="text-caption mb-1" style={{ color: semantic.textSubtle }}>
                  {compareThen?.date}
                </Text>
                <Text className="font-sans text-body-sm" style={{ color: semantic.textBody }}>
                  {compareThen?.wentWell}
                </Text>
              </View>
              <View className="w-px" style={{ backgroundColor: semantic.borderSubtle }} />
              <View className="flex-1">
                <Text className="text-caption mb-1" style={{ color: semantic.textSubtle }}>
                  {compareNow?.date}
                </Text>
                <Text className="font-sans text-body-sm" style={{ color: semantic.textBody }}>
                  {compareNow?.wentWell}
                </Text>
              </View>
            </View>
          </Card>
        </View>

        <View className="mt-4">
          <Tabs
            items={[
              { value: "open", label: "Open", count: state.actionItemsOpen.length },
              { value: "resolved", label: "Resolved", count: state.actionItemsResolved.length },
            ]}
            value={tab}
            onChange={(v) => setTab(v as "open" | "resolved")}
          />
        </View>

        <View className="mt-4">
          <WebGrid columns={2}>
            {tab === "open"
              ? state.actionItemsOpen.map((a) => (
                  <Card key={a.id}>
                    <View className="flex-row items-center gap-2 mb-1.5">
                      <Badge tone="warning">Open</Badge>
                      <Text className="text-caption ml-auto" style={{ color: semantic.textSubtle }}>
                        From {a.source}
                      </Text>
                    </View>
                    <Text className="font-sans text-body-sm" style={{ color: semantic.textBody }}>
                      {a.text}
                    </Text>
                    {a.lastRating ? (
                      <Text className="text-caption mt-1.5" style={{ color: semantic.textMuted }}>
                        Last check-in: {a.lastRating}
                      </Text>
                    ) : null}
                    <View className="mt-2.5 self-start">
                      <Button variant="secondary" size="sm" onPress={() => resolveActionItem(a.id)}>
                        Mark improved
                      </Button>
                    </View>
                  </Card>
                ))
              : state.actionItemsResolved.map((a) => (
                  <Card key={a.id} tone="sunken">
                    <View className="flex-row items-center gap-2 mb-1.5">
                      <Badge tone="success">Resolved</Badge>
                      <Text className="text-caption ml-auto" style={{ color: semantic.textSubtle }}>
                        {a.source}
                      </Text>
                    </View>
                    <Text className="font-sans text-body-sm" style={{ color: semantic.textBody }}>
                      {a.text}
                    </Text>
                  </Card>
                ))}
          </WebGrid>
        </View>
        </WebContainer>
      </ScrollView>
    </SafeAreaView>
  );
}
