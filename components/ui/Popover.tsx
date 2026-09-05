import * as PopoverPrimitive from "@rn-primitives/popover";
import * as React from "react";
import { Platform, StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens";

import { cn } from "@/lib/cn";

const FullWindowOverlay = Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment;

// React Native Reusables' popover.tsx — bg-popover border-border content, positioned
// near its trigger. Uses the same transparent tap-outside-to-close Overlay as
// Select.tsx (StyleSheet.absoluteFill, no dim) rather than Dialog's darkened one, since
// a popover shouldn't shade the screen behind it.
export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;

export const PopoverContent = React.forwardRef<
  PopoverPrimitive.ContentRef,
  PopoverPrimitive.ContentProps & { className?: string }
>(({ className, align = "start", sideOffset = 4, children, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <FullWindowOverlay>
      <PopoverPrimitive.Overlay
        style={Platform.select({ native: StyleSheet.absoluteFill })}
        asChild={Platform.OS !== "web"}
      >
        <Animated.View entering={FadeIn.duration(150)} exiting={FadeOut.duration(100)}>
          <PopoverPrimitive.Content
            ref={ref}
            align={align}
            sideOffset={sideOffset}
            className={cn(
              "bg-popover border-border w-72 rounded-md border p-4 shadow-md shadow-black/5",
              className,
            )}
            {...props}
          >
            {children}
          </PopoverPrimitive.Content>
        </Animated.View>
      </PopoverPrimitive.Overlay>
    </FullWindowOverlay>
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = "PopoverContent";
