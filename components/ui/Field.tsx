import { Text, View } from "react-native";

// Styled with RNR label.tsx's text treatment ("text-foreground text-sm font-medium")
// rather than the @rn-primitives/label primitive itself — this label is a plain caption
// above the field, not an interactive focus-the-input trigger.
export function Field({
  label,
  hint,
  children,
}: {
  label?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <View className="gap-1">
      {label ? <Text className="text-foreground text-sm font-medium">{label}</Text> : null}
      {children}
      {hint ? <Text className="text-muted-foreground text-xs">{hint}</Text> : null}
    </View>
  );
}
