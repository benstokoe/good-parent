import { Pressable } from "react-native";

import { useSemantic } from "@/lib/theme-context";
import { Icon, type IconName } from "@/components/ui/icon";

type Variant = "ghost" | "secondary" | "primary";
type Size = "sm" | "md" | "lg";

const SIZE_CLS: Record<Size, string> = {
  sm: "w-[30px] h-[30px]",
  md: "w-9 h-9",
  lg: "w-11 h-11",
};

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
  const semantic = useSemantic();
  const variantStyle =
    variant === "primary"
      ? { backgroundColor: semantic.actionPrimary, borderColor: "transparent" }
      : variant === "secondary"
        ? { backgroundColor: semantic.actionSecondary, borderColor: semantic.borderDefault }
        : { backgroundColor: "transparent", borderColor: "transparent" };

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      className={`rounded-md items-center justify-center border ${SIZE_CLS[size]}`}
      style={({ pressed }) => ({
        ...variantStyle,
        backgroundColor:
          pressed && variant === "ghost" ? semantic.surfaceHover : variantStyle.backgroundColor,
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
