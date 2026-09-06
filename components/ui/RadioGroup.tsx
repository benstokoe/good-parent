import { Pressable, Text, View } from "react-native";

import { radius, spacing, typography } from "@/lib/theme";
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
    <View style={{ gap: spacing[2] }}>
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            onPress={() => onChange(opt.value)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing[6],
              paddingVertical: spacing[5],
            }}
          >
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: radius.pill,
                borderWidth: 1,
                borderColor: selected ? semantic.borderAccent : semantic.borderDefault,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {selected ? (
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: radius.pill,
                    backgroundColor: semantic.actionPrimary,
                  }}
                />
              ) : null}
            </View>
            <Text style={[typography.bodyMD, { color: semantic.textBody }]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
