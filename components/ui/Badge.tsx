import { Text, View } from "react-native";

import { colors, radius, spacing, typography } from "@/lib/theme";
import { useSemantic } from "@/lib/theme-context";

export type BadgeTone = "neutral" | "accent" | "success" | "warning" | "danger" | "info";

export function Badge({
  tone = "neutral",
  dot,
  children,
}: {
  tone?: BadgeTone;
  dot?: boolean;
  children: string;
}) {
  const semantic = useSemantic();
  const { surface, text } = badgeColors(tone, semantic);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        gap: spacing[3],
        borderRadius: radius.pill,
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[1],
        backgroundColor: surface,
      }}
    >
      {dot ? (
        <View style={{ width: 6, height: 6, borderRadius: radius.pill, backgroundColor: text }} />
      ) : null}
      <Text style={[typography.caption, { fontFamily: typography.ui.fontFamily, color: text }]}>
        {children}
      </Text>
    </View>
  );
}

function badgeColors(tone: BadgeTone, semantic: ReturnType<typeof useSemantic>) {
  switch (tone) {
    case "accent":
      return { surface: semantic.surfaceAccent, text: semantic.textAccent };
    case "success":
      return { surface: colors.greenTint, text: colors.green };
    case "warning":
      return { surface: colors.amberTint, text: colors.amber };
    case "danger":
      return { surface: colors.redTint, text: colors.red };
    case "info":
      return { surface: colors.blueTint, text: colors.blue };
    case "neutral":
    default:
      return { surface: semantic.surfaceSunken, text: semantic.textMuted };
  }
}
