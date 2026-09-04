import { cva, type VariantProps } from "class-variance-authority";
import { Text, View } from "react-native";

import { cn } from "@/lib/cn";

// Adapted from React Native Reusables' badge.tsx — same pill shape (rounded-full border
// px-2 py-0.5), with tones mapped onto the app's existing warm/clay/success/warning/
// danger/info Tailwind color tokens instead of RNR's default/secondary/destructive set.
const badgeVariants = cva("group flex-row shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5", {
  variants: {
    tone: {
      neutral: "bg-muted border-transparent",
      accent: "bg-accent border-transparent",
      success: "bg-success-tint border-transparent",
      warning: "bg-warning-tint border-transparent",
      danger: "bg-danger-tint border-transparent",
      info: "bg-info-tint border-transparent",
    },
  },
  defaultVariants: {
    tone: "neutral",
  },
});

const badgeTextVariants = cva("text-xs font-medium", {
  variants: {
    tone: {
      neutral: "text-muted-foreground",
      accent: "text-accent-foreground",
      success: "text-success",
      warning: "text-warning",
      danger: "text-danger",
      info: "text-info",
    },
  },
  defaultVariants: {
    tone: "neutral",
  },
});

const dotVariants = cva("size-1.5 rounded-full", {
  variants: {
    tone: {
      neutral: "bg-muted-foreground",
      accent: "bg-accent-foreground",
      success: "bg-success",
      warning: "bg-warning",
      danger: "bg-danger",
      info: "bg-info",
    },
  },
  defaultVariants: {
    tone: "neutral",
  },
});

type BadgeVariants = VariantProps<typeof badgeVariants>;

export function Badge({
  tone = "neutral",
  dot,
  children,
}: {
  tone?: NonNullable<BadgeVariants["tone"]>;
  dot?: boolean;
  children: string;
}) {
  return (
    <View className={cn(badgeVariants({ tone }))}>
      {dot ? <View className={cn(dotVariants({ tone }))} /> : null}
      <Text className={cn(badgeTextVariants({ tone }))}>{children}</Text>
    </View>
  );
}
