import { cva, type VariantProps } from "class-variance-authority";
import { Pressable, View, type ViewProps } from "react-native";

import { cn } from "@/lib/cn";

// Adapted from React Native Reusables' card.tsx — same "bg-card border-border rounded-xl
// border shadow-sm shadow-black/5" treatment, extended with tone variants (RNR's own Card
// is a single bg-card/border-border pairing; sunken/accent/inverse map our extra surface
// tokens onto the same border+shadow structure rather than a bespoke look per tone).
const cardVariants = cva("rounded-xl border shadow-sm shadow-black/5", {
  variants: {
    tone: {
      default: "bg-card border-border",
      sunken: "bg-muted border-border",
      accent: "bg-accent border-transparent",
      inverse: "bg-foreground border-transparent",
    },
    padding: {
      none: "p-0",
      sm: "p-2",
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
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }
  return content;
}
