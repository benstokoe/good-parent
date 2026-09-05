import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { Pressable, type View } from "react-native";

import { Icon, type IconName } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { useSemantic } from "@/lib/theme-context";

// Sized/shaped like RNR's Button size="icon" (packages/registry/src/nativewind/
// components/ui/button.tsx), with the same primary/secondary/ghost variant treatment as
// our Button.tsx. Icon color is read from useSemantic() rather than a className, per
// lib/theme.ts's note — className can't reach a Lucide icon's `color` prop.
const iconButtonVariants = cva("items-center justify-center rounded-full border", {
  variants: {
    variant: {
      primary: "bg-primary border-transparent active:bg-primary/90",
      secondary: "bg-secondary border-border active:bg-accent",
      sunken: "bg-muted border-transparent active:bg-accent",
      ghost: "bg-transparent border-transparent active:bg-accent",
    },
    size: {
      sm: "h-9 w-9",
      md: "h-11 w-11",
      lg: "h-14 w-14",
    },
  },
  defaultVariants: {
    variant: "ghost",
    size: "md",
  },
});

const ICON_SIZES = { sm: 17, md: 20, lg: 24 } as const;

type IconButtonVariants = VariantProps<typeof iconButtonVariants>;

// forwardRef so IconButton can sit as a Popover/Dialog trigger's `asChild` child — those
// primitives clone their child and attach a ref to measure/anchor against it.
export const IconButton = forwardRef<
  View,
  {
    name: IconName;
    label: string;
    variant?: NonNullable<IconButtonVariants["variant"]>;
    size?: NonNullable<IconButtonVariants["size"]>;
    color?: string;
    disabled?: boolean;
    onPress?: () => void;
  }
>(function IconButton({ name, label, variant = "ghost", size = "md", color, disabled, onPress }, ref) {
  const semantic = useSemantic();
  return (
    <Pressable
      ref={ref}
      accessibilityLabel={label}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      className={cn(iconButtonVariants({ variant, size }), disabled && "opacity-50")}
    >
      <Icon
        name={name}
        size={ICON_SIZES[size]}
        color={color ?? (variant === "primary" ? "#fff" : semantic.textMuted)}
      />
    </Pressable>
  );
});
