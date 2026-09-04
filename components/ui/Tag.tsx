import { Pressable, Text } from "react-native";

import { cn } from "@/lib/cn";

// Not an RNR component (no filter-chip primitive in their registry) — styled with the
// same border-border/bg-card/bg-foreground tokens the rest of the swapped components use.
export function Tag({
  children,
  selected,
  onPress,
  fullWidth,
}: {
  children: string;
  selected?: boolean;
  onPress?: () => void;
  fullWidth?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        "flex-row items-center justify-center rounded-full border px-3.5 py-2",
        selected ? "bg-foreground border-transparent" : "bg-card border-border",
        fullWidth && "w-full",
      )}
    >
      <Text className={cn("text-sm font-medium leading-tight", selected ? "text-background" : "text-foreground")}>
        {children}
      </Text>
    </Pressable>
  );
}
