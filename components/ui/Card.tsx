import { Pressable, View, type ViewProps } from "react-native";

import { semantic } from "@/lib/theme";

type Tone = "default" | "sunken" | "accent" | "inverse";
type Padding = "none" | "sm" | "md" | "lg";

const PAD_CLS: Record<Padding, string> = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const TONE_BG: Record<Tone, string> = {
  default: semantic.surfaceCard,
  sunken: semantic.surfaceSunken,
  accent: semantic.surfaceAccent,
  inverse: semantic.surfaceInverse,
};

export function Card({
  tone = "default",
  padding = "md",
  onPress,
  style,
  children,
  ...rest
}: ViewProps & {
  tone?: Tone;
  padding?: Padding;
  onPress?: () => void;
  children?: React.ReactNode;
}) {
  const content = (
    <View
      {...rest}
      className={`rounded-lg ${PAD_CLS[padding]}`}
      style={[
        {
          backgroundColor: TONE_BG[tone],
          shadowColor: "#191918",
          shadowOpacity: 0.06,
          shadowRadius: 2,
          shadowOffset: { width: 0, height: 1 },
          elevation: 1,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }
  return content;
}
