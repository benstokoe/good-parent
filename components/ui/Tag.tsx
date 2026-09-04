import { Pressable, Text } from "react-native";

import { useSemantic } from "@/lib/theme-context";

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
  const semantic = useSemantic();
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center justify-center h-7 px-3 rounded-pill border ${fullWidth ? "w-full" : ""}`}
      style={{
        backgroundColor: selected ? semantic.surfaceInverse : semantic.surfaceCard,
        borderColor: selected ? "transparent" : semantic.borderDefault,
      }}
    >
      <Text
        className="font-sans-medium text-body-sm"
        style={{ color: selected ? semantic.textInverse : semantic.textBody }}
      >
        {children}
      </Text>
    </Pressable>
  );
}
