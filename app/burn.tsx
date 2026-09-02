import { router } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { IconButton } from "@/components/ui/IconButton";
import { Textarea } from "@/components/ui/Textarea";
import { semantic } from "@/lib/theme";

type Phase = "compose" | "releasing" | "done";

export default function BurnScreen() {
  const [phase, setPhase] = useState<Phase>("compose");
  const [text, setText] = useState("");
  const [releasingText, setReleasingText] = useState("");

  useEffect(() => {
    if (phase !== "releasing") return;
    const id = setTimeout(() => setPhase("done"), 1700);
    return () => clearTimeout(id);
  }, [phase]);

  const startBurn = () => {
    if (!text.trim()) return;
    setReleasingText(text);
    setText("");
    setPhase("releasing");
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: semantic.surfacePage }}>
      <View className="flex-row items-center gap-2.5 px-6 pb-3">
        <IconButton name="x" label="Close" onPress={() => router.back()} />
        <Text className="font-display text-title-sm" style={{ color: semantic.textHeading }}>
          Burn
        </Text>
      </View>

      <View className="flex-1 px-6 pb-6">
        {phase === "compose" ? (
          <>
            <Card tone="sunken">
              <Text className="font-sans text-body-sm" style={{ color: semantic.textMuted, lineHeight: 22 }}>
                Parenting is hard. Hard days happen. This won&apos;t be saved, linked to anything, or
                held against you.
              </Text>
            </Card>
            <Text
              className="font-display text-title-sm my-4"
              style={{ fontSize: 17, color: semantic.textHeading }}
            >
              What happened?
            </Text>
            <Textarea
              rows={6}
              placeholder="Write it down, then let it go."
              value={text}
              onChangeText={setText}
            />
            <View className="flex-1" />
            <Button
              variant="danger"
              fullWidth
              disabled={!text.trim()}
              onPress={startBurn}
            >
              Burn this
            </Button>
          </>
        ) : null}

        {phase === "releasing" ? (
          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut}
            className="flex-1 items-center justify-center"
          >
            <Text
              className="font-sans text-body-md text-center"
              style={{ color: semantic.textMuted, lineHeight: 26 }}
            >
              {releasingText}
            </Text>
          </Animated.View>
        ) : null}

        {phase === "done" ? (
          <Animated.View
            entering={FadeIn.duration(500)}
            className="flex-1 items-center justify-center gap-2"
          >
            <Text className="font-display text-title-md" style={{ color: semantic.textHeading }}>
              It&apos;s gone.
            </Text>
            <Text
              className="font-sans text-body-sm text-center max-w-[260px]"
              style={{ color: semantic.textMuted }}
            >
              That was a hard moment. Hard days happen — they don&apos;t define you as a parent.
            </Text>
            <View className="mt-5">
              <Button variant="primary" onPress={() => router.back()}>
                Done
              </Button>
            </View>
          </Animated.View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
