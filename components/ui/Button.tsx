import { ActivityIndicator, Pressable, Text } from "react-native";

import { colors } from "@/lib/theme";
import { useSemantic } from "@/lib/theme-context";
import type { Semantic } from "@/lib/theme";

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

// Background/border/text colors are computed from the active theme's semantic tokens
// rather than hardcoded Tailwind classes, so every variant (including its pressed and
// disabled states) adapts to light/dark. Pressed state uses Pressable's style callback.
function variantStyle(semantic: Semantic, variant: Variant) {
  switch (variant) {
    case "primary":
      return { bg: semantic.actionPrimary, pressedBg: semantic.actionPrimaryHover, border: "transparent", text: "#FFFFFF" };
    case "secondary":
      return { bg: semantic.actionSecondary, pressedBg: semantic.surfaceHover, border: semantic.borderDefault, text: semantic.textBody };
    case "ghost":
      return { bg: "transparent", pressedBg: semantic.surfaceHover, border: "transparent", text: semantic.textBody };
    case "inverse":
      return { bg: semantic.actionInverse, pressedBg: semantic.surfaceHover, border: "transparent", text: semantic.textInverse };
    case "danger":
      return { bg: colors.red, pressedBg: colors.clay[700], border: "transparent", text: "#FFFFFF" };
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
  const semantic = useSemantic();
  const inert = disabled || loading;
  const v = variantStyle(semantic, variant);
  const bg = inert ? (variant === "ghost" ? "transparent" : semantic.surfaceDisabled) : v.bg;
  const textColor = inert ? semantic.textDisabled : v.text;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inert }}
      disabled={inert}
      onPress={onPress}
      className={`flex-row items-center justify-center rounded-md gap-2 ${SIZE_CLS[size]} ${fullWidth ? "w-full" : "self-auto"}`}
      style={({ pressed }) => ({
        backgroundColor: pressed && !inert ? v.pressedBg : bg,
        borderWidth: 1,
        borderColor: inert ? "transparent" : v.border,
      })}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <Text
          className={`font-sans-medium ${TEXT_SIZE_CLS[size]}`}
          style={{ color: textColor }}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
}
