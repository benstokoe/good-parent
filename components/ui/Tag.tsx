import { Pressable, Text } from "react-native";

import { radius, spacing, typography } from "@/lib/theme";
import { useSemantic } from "@/lib/theme-context";

export function Tag({
  children,
  selected,
  onPress,
  fullWidth,
  size = "md",
}: {
  children: string;
  selected?: boolean;
  onPress?: () => void;
  fullWidth?: boolean;
  size?: "sm" | "md";
}) {
  const semantic = useSemantic();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityState={onPress ? { selected: !!selected } : undefined}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: fullWidth ? "stretch" : "flex-start",
        borderRadius: radius.pill,
        borderWidth: selected ? 0 : 1,
        borderColor: semantic.borderDefault,
        backgroundColor: selected ? semantic.actionPrimary : semantic.surfaceCard,
        paddingHorizontal: size === "sm" ? spacing[5] : spacing[6],
        paddingVertical: size === "sm" ? spacing[1] : spacing[4],
      }}
    >
      <Text
        style={[
          size === "sm" ? typography.caption : typography.bodySM,
          { fontFamily: typography.ui.fontFamily, color: selected ? semantic.textInverse : semantic.textBody },
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
}
