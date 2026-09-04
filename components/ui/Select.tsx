import * as SelectPrimitive from "@rn-primitives/select";
import * as React from "react";
import { Platform, StyleSheet } from "react-native";
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens";

import { useSemantic } from "@/lib/theme-context";
import { Icon } from "@/components/ui/icon";

export type SelectOption = { value: string; label: string };

const FullWindowOverlay = Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment;

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
      <SelectPrimitive.Trigger
        className="h-10 px-3 rounded-md border flex-row items-center justify-between"
        style={{ backgroundColor: semantic.surfaceCard, borderColor: semantic.borderDefault }}
      >
        <SelectPrimitive.Value
          placeholder="Select one"
          className="font-sans text-body-md"
          style={{ color: current ? semantic.textBody : semantic.textSubtle }}
        />
        <Icon name="chevron-right" size={16} color={semantic.textSubtle} />
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <FullWindowOverlay>
          <SelectPrimitive.Overlay style={Platform.select({ native: StyleSheet.absoluteFill })}>
            <SelectPrimitive.Content
              position="popper"
              sideOffset={4}
              className="rounded-md border p-1 min-w-[8rem]"
              style={{
                backgroundColor: semantic.surfaceCard,
                borderColor: semantic.borderDefault,
                boxShadow: "0px 4px 12px rgba(25,25,24,0.12)",
              }}
            >
              <SelectPrimitive.Viewport>
                {options.map((o) => (
                  <SelectPrimitive.Item
                    key={o.value}
                    value={o.value}
                    label={o.label}
                    className="px-3 py-2 rounded-sm"
                  >
                    <SelectPrimitive.ItemText
                      className="font-sans text-body-md"
                      style={{ color: o.value === value ? semantic.textAccent : semantic.textBody }}
                    />
                  </SelectPrimitive.Item>
                ))}
              </SelectPrimitive.Viewport>
            </SelectPrimitive.Content>
          </SelectPrimitive.Overlay>
        </FullWindowOverlay>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
