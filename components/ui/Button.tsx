import { ActivityIndicator, Pressable, Text } from "react-native";

import { semantic } from "@/lib/theme";

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

// Pressed/disabled state is expressed entirely via className (NativeWind's `active:`
// pseudo-class) rather than a function-valued `style` prop — mixing the two causes
// react-native-css-interop to drop the className-derived styles, since Pressable's
// dynamic `style` callback isn't a plain style object it can merge with.
const VARIANT_CLS: Record<Variant, string> = {
  primary: "bg-clay-400 active:bg-clay-500 border border-transparent",
  secondary: "bg-white active:bg-warm-100 border border-warm-300",
  ghost: "bg-transparent active:bg-warm-100 border border-transparent",
  inverse: "bg-warm-900 active:bg-warm-700 border border-transparent",
  danger: "bg-danger active:bg-clay-700 border border-transparent",
};

const DISABLED_CLS = "bg-warm-100 border border-transparent";
const DISABLED_GHOST_CLS = "bg-transparent border border-transparent";

const TEXT_COLOR: Record<Variant, string> = {
  primary: "#FFFFFF",
  danger: "#FFFFFF",
  secondary: semantic.textBody,
  ghost: semantic.textBody,
  inverse: semantic.textInverse,
};

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
  const variantCls = inert
    ? variant === "ghost"
      ? DISABLED_GHOST_CLS
      : DISABLED_CLS
    : VARIANT_CLS[variant];
  const textColor = inert ? semantic.textDisabled : TEXT_COLOR[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inert }}
      disabled={inert}
      onPress={onPress}
      className={`flex-row items-center justify-center rounded-md gap-2 ${SIZE_CLS[size]} ${fullWidth ? "w-full" : "self-auto"} ${variantCls}`}
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
