import * as DialogPrimitive from "@rn-primitives/dialog";
import * as React from "react";
import { Platform, Text, View, type GestureResponderEvent } from "react-native";
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens";

import { useSemantic } from "@/lib/theme-context";
import { IconButton } from "@/components/ui/IconButton";

const FullWindowOverlay = Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment;

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
    <DialogPrimitive.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogPrimitive.Portal>
        <FullWindowOverlay>
          <DialogPrimitive.Overlay
            className="flex-1 items-center justify-center px-6"
            style={{ backgroundColor: "rgba(25,25,24,0.32)" }}
            closeOnPress={false}
            onPress={(event: GestureResponderEvent) => {
              if (event.target === event.currentTarget) onClose();
            }}
          >
            <DialogPrimitive.Content
              className="w-full rounded-lg p-6 gap-4"
              style={{
                backgroundColor: semantic.surfaceCard,
                boxShadow: "0px 12px 32px rgba(25,25,24,0.28)",
              }}
            >
              <View className="flex-row items-center justify-between">
                <DialogPrimitive.Title asChild>
                  <Text
                    className="font-display text-title-sm"
                    style={{ color: semantic.textHeading }}
                  >
                    {title}
                  </Text>
                </DialogPrimitive.Title>
                <IconButton name="x" label="Close" onPress={onClose} />
              </View>
              <View className="gap-3">{children}</View>
              {footer ? <View className="flex-row gap-2 justify-end">{footer}</View> : null}
            </DialogPrimitive.Content>
          </DialogPrimitive.Overlay>
        </FullWindowOverlay>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
