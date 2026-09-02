import { Pressable } from "react-native";

import { semantic } from "@/lib/theme";
import { Icon, type IconName } from "@/components/ui/icon";

type Variant = "ghost" | "secondary" | "primary";
type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, number> = { sm: 30, md: 36, lg: 44 };
const ICON_SIZES: Record<Size, number> = { sm: 15, md: 18, lg: 20 };

export function IconButton({
  name,
  label,
  variant = "ghost",
  size = "md",
  color,
  onPress,
}: {
  name: IconName;
  label: string;
  variant?: Variant;
  size?: Size;
  color?: string;
  onPress?: () => void;
}) {
  const px = SIZES[size];
  const bordered = variant === "secondary";
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      className="rounded-md items-center justify-center border"
      style={({ pressed }) => ({
        width: px,
        height: px,
        backgroundColor:
          variant === "primary"
            ? semantic.actionPrimary
            : bordered
              ? semantic.actionSecondary
              : pressed
                ? semantic.surfaceHover
                : "transparent",
        borderColor: bordered ? semantic.borderDefault : "transparent",
      })}
    >
      <Icon
        name={name}
        size={ICON_SIZES[size]}
        color={color ?? (variant === "primary" ? "#fff" : semantic.textMuted)}
      />
    </Pressable>
  );
}
