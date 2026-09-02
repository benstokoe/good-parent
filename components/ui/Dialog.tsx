import { Modal, Pressable, Text, View } from "react-native";

import { semantic } from "@/lib/theme";
import { IconButton } from "@/components/ui/IconButton";

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
  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center px-6" style={{ backgroundColor: "rgba(25,25,24,0.32)" }}>
        <Pressable className="absolute inset-0" onPress={onClose} />
        <View
          className="w-full rounded-lg p-6 gap-4"
          style={{
            backgroundColor: semantic.surfaceCard,
            shadowColor: "#191918",
            shadowOpacity: 0.28,
            shadowRadius: 32,
            shadowOffset: { width: 0, height: 12 },
          }}
        >
          <View className="flex-row items-center justify-between">
            <Text className="font-display text-title-sm" style={{ color: semantic.textHeading }}>
              {title}
            </Text>
            <IconButton name="x" label="Close" onPress={onClose} />
          </View>
          <View className="gap-3">{children}</View>
          {footer ? <View className="flex-row gap-2 justify-end">{footer}</View> : null}
        </View>
      </View>
    </Modal>
  );
}
