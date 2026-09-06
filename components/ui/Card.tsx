import { Pressable, View, type StyleProp, type ViewProps, type ViewStyle } from "react-native";

import { radius, shadows, spacing } from "@/lib/theme";
import { useSemantic } from "@/lib/theme-context";

export type CardTone = "default" | "sunken" | "accent" | "inverse";
export type CardPadding = "none" | "sm" | "md" | "lg";

const PADDING: Record<CardPadding, number> = {
  none: 0,
  sm: spacing[5],
  md: spacing[6],
  lg: spacing[8],
};

export function Card({
  tone = "default",
  padding = "md",
  onPress,
  style,
  children,
  ...rest
}: ViewProps & {
  tone?: CardTone;
  padding?: CardPadding;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}) {
  const semantic = useSemantic();
  const backgroundColor = cardBackground(tone, semantic);

  const content = (
    <View
      {...rest}
      style={[
        {
          borderRadius: radius.lg,
          padding: PADDING[padding],
          backgroundColor,
        },
        shadows.xs,
        style,
      ]}
    >
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

function cardBackground(tone: CardTone, semantic: ReturnType<typeof useSemantic>) {
  switch (tone) {
    case "sunken":
      return semantic.surfaceSunken;
    case "accent":
      return semantic.surfaceAccent;
    case "inverse":
      return semantic.surfaceInverse;
    case "default":
    default:
      return semantic.surfaceCard;
  }
}
