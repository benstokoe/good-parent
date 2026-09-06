import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { IconButton } from "@/components/ui/IconButton";
import { radius, shadows, spacing, typography } from "@/lib/theme";
import { useSemantic } from "@/lib/theme-context";

// Plain RN Modal, not @expo/ui's universal BottomSheet: verified on-device that
// BottomSheet's SwiftUI sheet doesn't deliver touches to plain RN Pressable children
// (a footer's Cancel/Save buttons never fire onPress, though a native @expo/ui TextInput
// child inside the same sheet works fine) — a real defect, not a styling choice.
export function Dialog({
  open,
  title,
  onClose,
  footer,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  const semantic = useSemantic();

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1 }}>
        <Pressable
          style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0,0,0,0.5)" }]}
          onPress={onClose}
        />
        <KeyboardAvoidingView
          pointerEvents="box-none"
          style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: spacing[6] }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View
            style={[
              {
                width: "100%",
                gap: spacing[6],
                borderRadius: radius.lg,
                padding: spacing[6],
                backgroundColor: semantic.surfaceCard,
              },
              shadows.lg,
            ]}
          >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={[typography.titleSM, { color: semantic.textHeading }]}>{title}</Text>
              <IconButton name="x" label="Close" onPress={onClose} />
            </View>
            <View style={{ gap: spacing[5] }}>{children}</View>
            {footer ? (
              <View style={{ flexDirection: "row", gap: spacing[3], justifyContent: "flex-end" }}>{footer}</View>
            ) : null}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
