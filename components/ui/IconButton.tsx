import { Pressable } from "react-native";

import { semantic } from "@/lib/theme";
import { Icon, type IconName } from "@/components/ui/icon";

type Variant = "ghost" | "secondary" | "primary";
type Size = "sm" | "md" | "lg";

const SIZE_CLS: Record<Size, string> = {
  sm: "w-[30px] h-[30px]",
  md: "w-9 h-9",
  lg: "w-11 h-11",
};

const ICON_SIZES: Record<Size, number> = { sm: 15, md: 18, lg: 20 };

// Pressed state is expressed via className's `active:` pseudo-class rather than a
// function-valued `style` prop — see Button.tsx for why mixing the two breaks styling.
const VARIANT_CLS: Record<Variant, string> = {
  primary: "bg-clay-400 border border-transparent",
  secondary: "bg-white border border-warm-300",
  ghost: "bg-transparent active:bg-warm-100 border border-transparent",
};

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
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      className={`rounded-md items-center justify-center ${SIZE_CLS[size]} ${VARIANT_CLS[variant]}`}
    >
      <Icon
        name={name}
        size={ICON_SIZES[size]}
        color={color ?? (variant === "primary" ? "#fff" : semantic.textMuted)}
      />
    </Pressable>
  );
}
