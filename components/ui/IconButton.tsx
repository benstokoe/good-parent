import { useState } from "react";
import { Pressable, type View } from "react-native";

import { Icon, type IconName } from "@/components/ui/icon";
import { radius } from "@/lib/theme";
import { useSemantic } from "@/lib/theme-context";

export type IconButtonVariant = "primary" | "secondary" | "sunken" | "ghost";
export type IconButtonSize = "sm" | "md" | "lg";

const SIZE: Record<IconButtonSize, number> = { sm: 36, md: 44, lg: 56 };
const ICON_SIZE: Record<IconButtonSize, number> = { sm: 17, md: 20, lg: 24 };

// ref so IconButton can sit as a Popover/Dialog trigger's `asChild` child — those
// primitives clone their child and attach a ref to measure/anchor against it.
export function IconButton({
  name,
  label,
  variant = "ghost",
  size = "md",
  color,
  disabled,
  onPress,
  ref,
}: {
  name: IconName;
  label: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  color?: string;
  disabled?: boolean;
  onPress?: () => void;
  ref?: React.Ref<View>;
}) {
  const semantic = useSemantic();
  const { backgroundColor, borderColor, iconColor } = iconButtonColors(variant, semantic);
  const dimension = SIZE[size];
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      ref={ref}
      accessibilityLabel={label}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: dimension,
        height: dimension,
        borderRadius: radius.pill,
        backgroundColor,
        borderWidth: borderColor ? 1 : 0,
        borderColor,
        opacity: disabled ? 0.5 : pressed ? 0.7 : 1,
      }}
    >
      <Icon name={name} size={ICON_SIZE[size]} color={color ?? iconColor} />
    </Pressable>
  );
}

function iconButtonColors(variant: IconButtonVariant, semantic: ReturnType<typeof useSemantic>) {
  switch (variant) {
    case "primary":
      return { backgroundColor: semantic.actionPrimary, borderColor: undefined, iconColor: "#FFFFFF" };
    case "secondary":
      return {
        backgroundColor: semantic.actionSecondary,
        borderColor: semantic.borderDefault,
        iconColor: semantic.textBody,
      };
    case "sunken":
      return { backgroundColor: semantic.surfaceSunken, borderColor: undefined, iconColor: semantic.textMuted };
    case "ghost":
    default:
      return { backgroundColor: "transparent", borderColor: undefined, iconColor: semantic.textMuted };
  }
}
