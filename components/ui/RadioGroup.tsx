import * as RadioGroupPrimitive from "@rn-primitives/radio-group";
import { Platform, Pressable, Text } from "react-native";

import { cn } from "@/lib/cn";

export type RadioOption = { value: string; label: string };

// React Native Reusables' radio-group.tsx, kept behind the app's existing declarative
// options/value/onChange API rather than the compound RadioGroupItem-per-child form.
export function RadioGroup({
  options,
  value,
  onChange,
}: {
  options: RadioOption[];
  value: string | null;
  onChange: (value: string) => void;
}) {
  return (
    <RadioGroupPrimitive.Root value={value ?? undefined} onValueChange={onChange} className="gap-1">
      {options.map((opt) => (
        <Pressable
          key={opt.value}
          onPress={() => onChange(opt.value)}
          className="flex-row items-center gap-3 py-2.5"
        >
          <RadioGroupPrimitive.Item
            value={opt.value}
            className={cn(
              "border-input aspect-square size-6 shrink-0 items-center justify-center rounded-full border shadow-sm shadow-black/5",
              Platform.select({
                web: "focus-visible:border-ring focus-visible:ring-ring/50 outline-none transition-all focus-visible:ring-[3px]",
              }),
            )}
          >
            <RadioGroupPrimitive.Indicator className="bg-primary size-3 rounded-full" />
          </RadioGroupPrimitive.Item>
          <Text className="text-foreground text-base">{opt.label}</Text>
        </Pressable>
      ))}
    </RadioGroupPrimitive.Root>
  );
}
