import { Text, View } from "react-native";

import { cn } from "@/lib/cn";

// Styled with RNR label.tsx's text treatment ("text-foreground text-sm font-medium")
// rather than the @rn-primitives/label primitive itself — this label is a plain caption
// above the field, not an interactive focus-the-input trigger.
export function Field({
  label,
  hint,
  className,
  children,
}: {
  label?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <View className={cn("gap-1", className)}>
      {label ? <Text className="font-sans text-foreground text-sm font-medium">{label}</Text> : null}
      {children}
      {hint ? <Text className="font-sans text-muted-foreground text-xs">{hint}</Text> : null}
    </View>
  );
}
