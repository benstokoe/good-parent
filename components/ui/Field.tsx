import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

import { spacing, typography } from "@/lib/theme";
import { useSemantic } from "@/lib/theme-context";

export function Field({
  label,
  hint,
  style,
  children,
}: {
  label?: string;
  hint?: string;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}) {
  const semantic = useSemantic();

  return (
    <View style={[styles.container, style]}>
      {label ? <Text style={[styles.label, { color: semantic.textBody }]}>{label}</Text> : null}
      {children}
      {hint ? <Text style={[styles.hint, { color: semantic.textMuted }]}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing[2] },
  label: typography.ui,
  hint: typography.caption,
});
