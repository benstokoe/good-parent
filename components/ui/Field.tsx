import { Text, View } from "react-native";

import { useSemantic } from "@/lib/theme-context";

export function Field({
  label,
  hint,
  children,
}: {
  label?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  const semantic = useSemantic();
  return (
    <View className="gap-2">
      {label ? (
        <Text className="font-sans-medium text-body-sm" style={{ color: semantic.textBody }}>
          {label}
        </Text>
      ) : null}
      {children}
      {hint ? (
        <Text className="text-caption" style={{ color: semantic.textSubtle }}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}
