import * as RadioGroupPrimitive from "@rn-primitives/radio-group";
import { Pressable, Text, View } from "react-native";

import { useSemantic } from "@/lib/theme-context";

export type RadioOption = { value: string; label: string };

export function RadioGroup({
  options,
  value,
  onChange,
}: {
  options: RadioOption[];
  value: string | null;
  onChange: (value: string) => void;
}) {
  const semantic = useSemantic();
  return (
    <RadioGroupPrimitive.Root
      value={value ?? undefined}
      onValueChange={onChange}
      className="gap-3"
    >
      {options.map((opt) => {
        const on = value === opt.value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            className="flex-row items-center gap-3"
          >
            <RadioGroupPrimitive.Item
              value={opt.value}
              className="w-[18px] h-[18px] rounded-full items-center justify-center"
              style={{
                backgroundColor: semantic.surfaceCard,
                borderWidth: on ? 5 : 1,
                borderColor: on ? semantic.actionPrimary : semantic.borderStrong,
              }}
            >
              {on ? (
                <RadioGroupPrimitive.Indicator>
                  <View />
                </RadioGroupPrimitive.Indicator>
              ) : null}
            </RadioGroupPrimitive.Item>
            <Text className="font-sans text-body-md" style={{ color: semantic.textBody }}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </RadioGroupPrimitive.Root>
  );
}
