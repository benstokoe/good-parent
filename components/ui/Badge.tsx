import { Text, View } from "react-native";

import { colors, semantic } from "@/lib/theme";

type Tone = "neutral" | "accent" | "success" | "warning" | "danger" | "info";

const TONES: Record<Tone, { background: string; color: string }> = {
  neutral: { background: colors.warm[100], color: semantic.textMuted },
  accent: { background: colors.clay[50], color: colors.clay[600] },
  success: { background: colors.greenTint, color: colors.green },
  warning: { background: colors.amberTint, color: colors.amber },
  danger: { background: colors.redTint, color: colors.red },
  info: { background: colors.blueTint, color: colors.blue },
};

export function Badge({
  tone = "neutral",
  dot,
  children,
}: {
  tone?: Tone;
  dot?: boolean;
  children: string;
}) {
  const t = TONES[tone];
  return (
    <View
      className="flex-row items-center gap-1.5 h-[22px] px-2 rounded-pill"
      style={{ backgroundColor: t.background }}
    >
      {dot ? <View className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: t.color }} /> : null}
      <Text className="font-sans-medium text-caption" style={{ color: t.color }}>
        {children}
      </Text>
    </View>
  );
}
