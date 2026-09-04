import * as SelectPrimitive from "@rn-primitives/select";
import * as React from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens";

import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { useSemantic } from "@/lib/theme-context";

export type SelectOption = { value: string; label: string };

const FullWindowOverlay = Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment;

// React Native Reusables' select.tsx classNames (bg-background trigger, bg-popover
// content, Check indicator) kept behind the app's declarative options/value/onChange
// API. Uses a plain Animated.View fade like Dialog.tsx rather than RNR's
// NativeOnlyAnimatedView indirection, since this trigger isn't itself animated.
export function Select({
  options,
  value,
  onChange,
}: {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  const semantic = useSemantic();
  const current = options.find((o) => o.value === value);

  return (
    <SelectPrimitive.Root
      value={current}
      onValueChange={(option) => option && onChange(option.value)}
    >
      <SelectPrimitive.Trigger className="border-input bg-background flex h-10 flex-row items-center justify-between gap-2 rounded-md border px-3 py-2 shadow-sm shadow-black/5">
        <SelectPrimitive.Value
          placeholder="Select one"
          className={cn("text-sm", current ? "text-foreground" : "text-muted-foreground")}
        />
        <Icon name="chevron-down" size={16} color={semantic.textSubtle} />
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <FullWindowOverlay>
          <SelectPrimitive.Overlay
            style={Platform.select({ native: StyleSheet.absoluteFill })}
            asChild={Platform.OS !== "web"}
          >
            <Animated.View entering={FadeIn.duration(150)} exiting={FadeOut.duration(100)}>
              <SelectPrimitive.Content
                position="popper"
                sideOffset={4}
                className="bg-popover border-border min-w-[8rem] rounded-md border p-1 shadow-md shadow-black/5"
              >
                <SelectPrimitive.Viewport>
                  {options.map((o) => (
                    <SelectPrimitive.Item
                      key={o.value}
                      value={o.value}
                      label={o.label}
                      className="active:bg-accent relative flex w-full flex-row items-center gap-2 rounded-sm py-2 pl-2 pr-8"
                    >
                      <View className="absolute right-2 flex size-3.5 items-center justify-center">
                        <SelectPrimitive.ItemIndicator>
                          <Icon name="check" size={16} color={semantic.textMuted} />
                        </SelectPrimitive.ItemIndicator>
                      </View>
                      <SelectPrimitive.ItemText className="text-foreground text-sm" />
                    </SelectPrimitive.Item>
                  ))}
                </SelectPrimitive.Viewport>
              </SelectPrimitive.Content>
            </Animated.View>
          </SelectPrimitive.Overlay>
        </FullWindowOverlay>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
