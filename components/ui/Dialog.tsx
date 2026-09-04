import * as DialogPrimitive from "@rn-primitives/dialog";
import * as React from "react";
import { Platform, Text, View, type GestureResponderEvent } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens";

import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/cn";

const FullWindowOverlay = Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment;

// React Native Reusables' dialog.tsx — bg-background/50 overlay, bg-background
// border-border content with FadeIn/FadeOut — ported with the app's own close-button
// placement (see components/ui/IconButton.tsx) instead of RNR's floating top-right X.
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
    <DialogPrimitive.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogPrimitive.Portal>
        <FullWindowOverlay>
          <DialogPrimitive.Overlay
            className="flex-1 bg-black/50"
            closeOnPress={false}
            onPress={(event: GestureResponderEvent) => {
              if (event.target === event.currentTarget) onClose();
            }}
          >
            <Animated.View
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(150)}
              className="flex-1 items-center justify-center px-4"
              pointerEvents="box-none"
            >
              <Animated.View entering={FadeIn.duration(200).delay(30)} exiting={FadeOut.duration(150)}>
                <DialogPrimitive.Content className="bg-card border-border w-full gap-4 rounded-lg border p-6 shadow-lg shadow-black/5">
                  <View className="flex-row items-center justify-between">
                    <DialogPrimitive.Title asChild>
                      <Text className={cn("font-display text-title-sm text-foreground")}>{title}</Text>
                    </DialogPrimitive.Title>
                    <IconButton name="x" label="Close" onPress={onClose} />
                  </View>
                  <View className="gap-1.5">{children}</View>
                  {footer ? <View className="flex-row gap-1 justify-end">{footer}</View> : null}
                </DialogPrimitive.Content>
              </Animated.View>
            </Animated.View>
          </DialogPrimitive.Overlay>
        </FullWindowOverlay>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
