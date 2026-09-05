import { cva, type VariantProps } from "class-variance-authority";
import { Pressable, View, type ViewProps } from "react-native";

import { cn } from "@/lib/cn";

// Adapted from React Native Reusables' card.tsx, minus RNR's border: DESIGN.md separates
// filled cards from the page via tonal surface steps only, never a stroke. sunken/accent/
// inverse map our extra surface tokens onto the same tone+shadow structure per DESIGN.md's
// card spec (default = surface, sunken = surfaceSunken, accent = a pale clay-adjacent tint).
const cardVariants = cva("rounded-xl shadow-sm shadow-black/5", {
  variants: {
    tone: {
      default: "bg-card",
      sunken: "bg-muted",
      accent: "bg-accent",
      inverse: "bg-foreground",
    },
    padding: {
      none: "p-0",
      sm: "p-3",
      md: "p-4",
      lg: "p-6",
    },
  },
  defaultVariants: {
    tone: "default",
    padding: "md",
  },
});

type CardVariants = VariantProps<typeof cardVariants>;

export function Card({
  tone = "default",
  padding = "md",
  onPress,
  className,
  children,
  ...rest
}: ViewProps & {
  tone?: NonNullable<CardVariants["tone"]>;
  padding?: NonNullable<CardVariants["padding"]>;
  onPress?: () => void;
  children?: React.ReactNode;
}) {
  const content = (
    <View {...rest} className={cn(cardVariants({ tone, padding }), className)}>
      {children}
    </View>
  );
  if (onPress) {
    return (
      <Pressable onPress={onPress} accessibilityRole="button">
        {content}
      </Pressable>
    );
  }
  return content;
}
