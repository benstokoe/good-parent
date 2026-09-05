import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { JournalEntryForm } from "@/components/JournalEntryForm";
import { WebContainer } from "@/components/web/WebContainer";
import { useSemantic } from "@/lib/theme-context";

export default function JournalEntryScreen() {
  const semantic = useSemantic();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();

  return (
    <SafeAreaView
      className="flex-1"
      edges={["top", "left", "right"]}
      style={{ backgroundColor: semantic.surfacePage }}
    >
      <WebContainer maxWidth={560} style={{ flex: 1 }}>
        <JournalEntryForm id={id} onClose={() => router.back()} bottomInset={insets.bottom} />
      </WebContainer>
    </SafeAreaView>
  );
}
