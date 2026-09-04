import { Pressable, View, type ViewProps } from "react-native";

import { useSemantic } from "@/lib/theme-context";

type Tone = "default" | "sunken" | "accent" | "inverse";
type Padding = "none" | "sm" | "md" | "lg";

const PAD_CLS: Record<Padding, string> = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
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
  const semantic = useSemantic();
  const TONE_BG: Record<Tone, string> = {
    default: semantic.surfaceCard,
    sunken: semantic.surfaceSunken,
    accent: semantic.surfaceAccent,
    inverse: semantic.surfaceInverse,
  };
  const content = (
    <View
      {...rest}
      className={`rounded-lg ${PAD_CLS[padding]}`}
      style={[
        {
          backgroundColor: TONE_BG[tone],
          boxShadow: "0px 1px 2px rgba(25,25,24,0.06)",
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
