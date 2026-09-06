import { useState } from "react";
import { ActivityIndicator, Pressable, Text, type StyleProp, type ViewStyle } from "react-native";

import { colors, radius, shadows, spacing, typography } from "@/lib/theme";
import { useSemantic } from "@/lib/theme-context";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "inverse" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const SIZE: Record<ButtonSize, { height: number; paddingHorizontal: number; fontSize: number }> = {
  sm: { height: 44, paddingHorizontal: spacing[5], fontSize: typography.bodySM.fontSize },
  md: { height: 48, paddingHorizontal: spacing[6], fontSize: typography.bodyMD.fontSize },
  lg: { height: 56, paddingHorizontal: spacing[8], fontSize: typography.bodyMD.fontSize },
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  onPress,
  style,
}: {
  children: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const semantic = useSemantic();
  const inert = disabled || loading;
  const { backgroundColor, borderColor, textColor } = buttonColors(variant, semantic);
  const sizeStyle = SIZE[size];
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inert }}
      disabled={inert}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: spacing[3],
          borderRadius: radius.pill,
          height: sizeStyle.height,
          paddingHorizontal: sizeStyle.paddingHorizontal,
          alignSelf: fullWidth ? "stretch" : "flex-start",
          backgroundColor,
          borderWidth: borderColor ? 1 : 0,
          borderColor,
          opacity: inert ? 0.5 : pressed ? 0.7 : 1,
        },
        variant !== "ghost" ? shadows.sm : null,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <Text style={{ fontFamily: typography.ui.fontFamily, fontSize: sizeStyle.fontSize, color: textColor }}>
          {children}
        </Text>
      )}
    </Pressable>
  );
}

function buttonColors(variant: ButtonVariant, semantic: ReturnType<typeof useSemantic>) {
  switch (variant) {
    case "secondary":
      return {
        backgroundColor: semantic.actionSecondary,
        borderColor: semantic.borderDefault,
        textColor: semantic.textBody,
      };
    case "ghost":
      return { backgroundColor: "transparent", borderColor: undefined, textColor: semantic.textBody };
    case "inverse":
      return {
        backgroundColor: semantic.actionInverse,
        borderColor: undefined,
        textColor: semantic.textInverse,
      };
    case "danger":
      return { backgroundColor: colors.red, borderColor: undefined, textColor: "#FFFFFF" };
    case "primary":
    default:
      return {
        backgroundColor: semantic.actionPrimary,
        borderColor: undefined,
        textColor: "#FFFFFF",
      };
  }
}
