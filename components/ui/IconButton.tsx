import { cva, type VariantProps } from "class-variance-authority";
import { Pressable } from "react-native";

import { Icon, type IconName } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { useSemantic } from "@/lib/theme-context";

// Sized/shaped like RNR's Button size="icon" (packages/registry/src/nativewind/
// components/ui/button.tsx), with the same primary/secondary/ghost variant treatment as
// our Button.tsx. Icon color is read from useSemantic() rather than a className, per
// lib/theme.ts's note — className can't reach a Lucide icon's `color` prop.
const iconButtonVariants = cva("items-center justify-center rounded-md border", {
  variants: {
    variant: {
      primary: "bg-primary border-transparent active:bg-primary/90",
      secondary: "bg-secondary border-border active:bg-accent",
      ghost: "bg-transparent border-transparent active:bg-accent",
    },
    size: {
      sm: "h-[30px] w-[30px]",
      md: "h-8 w-8",
      lg: "h-12 w-12",
    },
  },
  defaultVariants: {
    variant: "ghost",
    size: "md",
  },
});

const ICON_SIZES = { sm: 15, md: 18, lg: 20 } as const;

type IconButtonVariants = VariantProps<typeof iconButtonVariants>;

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
  variant?: NonNullable<IconButtonVariants["variant"]>;
  size?: NonNullable<IconButtonVariants["size"]>;
  color?: string;
  onPress?: () => void;
}) {
  const semantic = useSemantic();
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      className={cn(iconButtonVariants({ variant, size }))}
    >
      <Icon
        name={name}
        size={ICON_SIZES[size]}
        color={color ?? (variant === "primary" ? "#fff" : semantic.textMuted)}
      />
    </Pressable>
  );
}
