import { ActivityIndicator, Pressable, Text, type ViewStyle } from "react-native";

import { colors, semantic } from "@/lib/theme";

type Variant = "primary" | "secondary" | "ghost" | "inverse" | "danger";
type Size = "sm" | "md" | "lg";

const SIZE_CLS: Record<Size, string> = {
  sm: "h-9 px-5",
  md: "h-9 px-6",
  lg: "h-11 px-8",
};

const TEXT_SIZE_CLS: Record<Size, string> = {
  sm: "text-body-sm",
  md: "text-body-md",
  lg: "text-body-lg",
};

function variantStyle(variant: Variant, disabled: boolean, pressed: boolean): ViewStyle {
  if (disabled) {
    return {
      backgroundColor: variant === "ghost" ? "transparent" : semantic.surfaceDisabled,
      borderColor: "transparent",
      borderWidth: 1,
    };
  }
  switch (variant) {
    case "primary":
      return {
        backgroundColor: pressed ? semantic.actionPrimaryActive : semantic.actionPrimary,
        borderColor: "transparent",
        borderWidth: 1,
      };
    case "secondary":
      return {
        backgroundColor: pressed ? semantic.surfaceActive : semantic.actionSecondary,
        borderColor: semantic.borderDefault,
        borderWidth: 1,
      };
    case "ghost":
      return {
        backgroundColor: pressed ? semantic.surfaceActive : "transparent",
        borderColor: "transparent",
        borderWidth: 1,
      };
    case "inverse":
      return {
        backgroundColor: pressed ? colors.warm[700] : semantic.actionInverse,
        borderColor: "transparent",
        borderWidth: 1,
      };
    case "danger":
      return {
        backgroundColor: pressed ? colors.clay[700] : colors.red,
        borderColor: "transparent",
        borderWidth: 1,
      };
  }
}

function textColor(variant: Variant, disabled: boolean): string {
  if (disabled) return semantic.textDisabled;
  switch (variant) {
    case "primary":
    case "danger":
      return "#FFFFFF";
    case "secondary":
      return semantic.textBody;
    case "ghost":
      return semantic.textBody;
    case "inverse":
      return semantic.textInverse;
  }
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  onPress,
}: {
  children: string;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onPress?: () => void;
}) {
  const inert = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inert }}
      disabled={inert}
      onPress={onPress}
      className={`flex-row items-center justify-center rounded-md gap-2 ${SIZE_CLS[size]} ${fullWidth ? "w-full" : "self-auto"}`}
      style={({ pressed }) => variantStyle(variant, inert, pressed)}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor(variant, inert)} />
      ) : (
        <Text
          className={`font-sans-medium ${TEXT_SIZE_CLS[size]}`}
          style={{ color: textColor(variant, inert) }}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
}
