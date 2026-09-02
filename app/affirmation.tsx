import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BreathingOrb } from "@/components/BreathingOrb";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Tabs } from "@/components/ui/Tabs";
import { AFFIRMATION_PACKS } from "@/lib/affirmations";
import { colors } from "@/lib/theme";

const CATEGORY_OPTIONS = [
  { value: "general", label: "General" },
  { value: "newborn", label: "Newborn" },
  { value: "toddler", label: "Toddler" },
  { value: "solo", label: "Solo parenting" },
];

export default function AffirmationScreen() {
  const [category, setCategory] = useState("general");
  const [index, setIndex] = useState(0);

  const pack = AFFIRMATION_PACKS[category] ?? AFFIRMATION_PACKS.general;
  const current = pack[index % pack.length];

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.warm[900] }}>
      <View className="flex-row justify-between items-center px-5 pb-3">
        <IconButton name="x" label="Close" onPress={() => router.back()} color="#fff" />
        <IconButton name="share-2" label="Share" color="#fff" onPress={() => {}} />
      </View>
      <View className="px-6">
        <Tabs
          items={CATEGORY_OPTIONS}
          value={category}
          onChange={(v) => {
            setCategory(v);
            setIndex(0);
          }}
        />
      </View>

      <View className="flex-1 items-center justify-center px-8">
        <View className="mb-9">
          <BreathingOrb size={120} colors={[colors.clay[400], colors.clay[600]]} durationMs={6000} />
        </View>
        <Text
          className="font-display text-display-md text-center"
          style={{ color: colors.warm[50], lineHeight: 38 }}
        >
          I am a good parent.
        </Text>
        <Text
          className="font-sans text-body-md text-center mt-5"
          style={{ color: colors.warm[300], minHeight: 50 }}
        >
          {current}
        </Text>
      </View>

      <View className="flex-row justify-center gap-1.5 pb-4">
        {pack.map((_, i) => (
          <View
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: i === index ? colors.clay[400] : "rgba(255,255,255,0.25)" }}
          />
        ))}
      </View>

      <View className="px-6 pb-6">
        <Button
          variant="inverse"
          fullWidth
          onPress={() => setIndex((i) => (i + 1) % pack.length)}
        >
          Say the next one
        </Button>
      </View>
    </SafeAreaView>
  );
}
