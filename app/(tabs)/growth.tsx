import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ExpandableText } from "@/components/ui/ExpandableText";
import { Icon } from "@/components/ui/icon";
import { Tabs } from "@/components/ui/Tabs";
import { useAppData } from "@/lib/app-data";
import { colors } from "@/lib/theme";
import { useSemantic } from "@/lib/theme-context";

export default function GrowthScreen() {
  const semantic = useSemantic();
  const { state, resolveActionItem } = useAppData();
  const [tab, setTab] = useState<"open" | "resolved">("open");

  const compareThen = state.checkins[2];
  const compareNow = state.checkins[0];

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: semantic.surfacePage }}>
      <ScrollView className="flex-1" contentContainerClassName="px-4 pt-3 pb-28">
        <Text className="font-display text-display-md" style={{ color: semantic.textHeading }}>
          Growth Space
        </Text>
        <Text className="font-sans text-body-sm mt-0.5" style={{ color: semantic.textMuted }}>
          What&apos;s still a work in progress. Kept apart so the homepage stays about what&apos;s
          going right.
        </Text>

        <View className="gap-6 mt-6">
          <Card tone="accent" padding="lg">
            <View className="flex-row items-center gap-1.5 mb-3">
              <Icon name="refresh-cw" size={13} color={semantic.textAccent} />
              <Text
                className="text-caption tracking-wide font-sans-semibold"
                style={{ color: semantic.textAccent }}
              >
                YOU, THEN AND NOW
              </Text>
            </View>
            <View className="gap-3.5">
              <View>
                <Text
                  className="text-caption tracking-wide uppercase mb-1"
                  style={{ color: semantic.textSubtle }}
                >
                  {compareThen?.date}
                </Text>
                {compareThen ? (
                  <ExpandableText
                    className="font-display text-title-sm"
                    style={{ fontSize: 16, lineHeight: 22, color: semantic.textBody }}
                    lineHeight={22}
                    numberOfLines={2}
                  >
                    {compareThen.wentWell}
                  </ExpandableText>
                ) : null}
              </View>
              <View className="h-px" style={{ backgroundColor: semantic.borderSubtle }} />
              <View>
                <Text
                  className="text-caption tracking-wide uppercase mb-1"
                  style={{ color: semantic.textSubtle }}
                >
                  {compareNow?.date}
                </Text>
                {compareNow ? (
                  <ExpandableText
                    className="font-display text-title-sm"
                    style={{ fontSize: 16, lineHeight: 22, color: semantic.textBody }}
                    lineHeight={22}
                    numberOfLines={2}
                  >
                    {compareNow.wentWell}
                  </ExpandableText>
                ) : null}
              </View>
            </View>
          </Card>

          <View className="gap-3">
            <Tabs
              items={[
                { value: "open", label: "Open", count: state.actionItemsOpen.length },
                { value: "resolved", label: "Resolved", count: state.actionItemsResolved.length },
              ]}
              value={tab}
              onChange={(v) => setTab(v as "open" | "resolved")}
            />

            <View className="gap-3">
              {tab === "open"
                ? state.actionItemsOpen.map((a) => (
                    <Card key={a.id} padding="lg">
                      <View className="flex-row items-center gap-1 mb-2">
                        <Badge tone="warning">Open</Badge>
                        <Text
                          className="text-caption ml-auto"
                          style={{ color: semantic.textSubtle }}
                        >
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
                      <View className="mt-3 self-start">
                        <Button variant="secondary" size="sm" onPress={() => resolveActionItem(a.id)}>
                          Mark improved
                        </Button>
                      </View>
                    </Card>
                  ))
                : state.actionItemsResolved.map((a) => (
                    <Card key={a.id} tone="sunken" padding="lg">
                      <View className="flex-row items-center gap-1 mb-2">
                        <View className="flex-row items-center gap-1">
                          <Icon name="circle-check" size={12} color={colors.green} />
                          <Badge tone="success">Resolved</Badge>
                        </View>
                        <Text
                          className="text-caption ml-auto"
                          style={{ color: semantic.textSubtle }}
                        >
                          {a.source}
                        </Text>
                      </View>
                      <Text className="font-sans text-body-sm" style={{ color: semantic.textBody }}>
                        {a.text}
                      </Text>
                    </Card>
                  ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
