import { Pressable, Text } from "react-native";

import { cn } from "@/lib/cn";

// Not an RNR component (no filter-chip primitive in their registry) — styled with the
// same border-border/bg-card/bg-foreground tokens the rest of the swapped components use.
// `size="sm"` is the read-only badge look for tags rendered on a card (e.g. journal entry
// tags) — same unselected pill language, scaled down instead of forked into a new component.
export function Tag({
  children,
  selected,
  onPress,
  fullWidth,
  size = "md",
}: {
  children: string;
  selected?: boolean;
  onPress?: () => void;
  fullWidth?: boolean;
  size?: "sm" | "md";
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityState={onPress ? { selected: !!selected } : undefined}
      className={cn(
        "flex-row items-center justify-center rounded-full border",
        size === "sm" ? "px-2.5 py-0.5" : "px-3.5 py-3",
        selected ? "bg-primary border-transparent" : "bg-card border-border",
        fullWidth && "w-full",
      )}
    >
      <Text
        className={cn(
          "font-medium leading-tight",
          size === "sm" ? "text-caption" : "text-sm",
          selected ? "text-primary-foreground" : "text-foreground",
        )}
      >
        {children}
      </Text>
    </Pressable>
  );
}
