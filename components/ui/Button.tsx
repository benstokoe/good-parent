import { cva, type VariantProps } from "class-variance-authority";
import { ActivityIndicator, Platform, Pressable, Text } from "react-native";

import { cn } from "@/lib/cn";

// Adapted from React Native Reusables' button.tsx (packages/registry/src/nativewind/
// components/ui/button.tsx) — same cva structure and class names, styled through the
// bg-primary/bg-secondary/etc tokens in global.css rather than shadcn's palette. "inverse"
// and "danger" are app-specific additions on top of RNR's default variant set.
const buttonVariants = cva(
  cn(
    "group shrink-0 flex-row items-center justify-center gap-2 rounded-full shadow-none",
    Platform.select({
      web: "outline-none transition-all disabled:pointer-events-none",
    }),
  ),
  {
    variants: {
      variant: {
        primary: cn(
          "bg-primary active:bg-primary/90 shadow-sm shadow-black/5",
          Platform.select({ web: "hover:bg-primary/90" }),
        ),
        secondary: cn(
          "bg-secondary border-border active:bg-accent border shadow-sm shadow-black/5",
          Platform.select({ web: "hover:bg-accent" }),
        ),
        ghost: cn("active:bg-accent", Platform.select({ web: "hover:bg-accent" })),
        inverse: cn(
          "bg-foreground active:bg-foreground/90 shadow-sm shadow-black/5",
          Platform.select({ web: "hover:bg-foreground/90" }),
        ),
        danger: cn(
          "bg-destructive active:bg-destructive/90 shadow-sm shadow-black/5",
          Platform.select({ web: "hover:bg-destructive/90" }),
        ),
      },
      size: {
        sm: "h-11 gap-1.5 px-3",
        md: "h-12 px-4 py-2",
        lg: "h-14 px-6",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

const buttonTextVariants = cva(
  cn("text-sm font-medium", Platform.select({ web: "pointer-events-none transition-colors" })),
  {
    variants: {
      variant: {
        primary: "text-primary-foreground",
        secondary: "text-secondary-foreground",
        ghost: cn(
          "text-foreground group-active:text-accent-foreground",
          Platform.select({ web: "group-hover:text-accent-foreground" }),
        ),
        inverse: "text-background",
        danger: "text-destructive-foreground",
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonVariants = VariantProps<typeof buttonVariants>;

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
  variant?: NonNullable<ButtonVariants["variant"]>;
  size?: NonNullable<ButtonVariants["size"]>;
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
      className={cn(
        buttonVariants({ variant, size }),
        fullWidth && "w-full",
        inert && "opacity-50",
      )}
    >
      {loading ? (
        <ActivityIndicator size="small" />
      ) : (
        <Text className={cn(buttonTextVariants({ variant, size }))}>{children}</Text>
      )}
    </Pressable>
  );
}
