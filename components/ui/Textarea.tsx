import { useState } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

import { Host, TextInput } from "@expo/ui";

import { radius, spacing, typography } from "@/lib/theme";
import { useSemantic } from "@/lib/theme-context";

export function Textarea({
  value,
  onChangeText,
  placeholder,
  autoFocus,
  rows = 4,
  style,
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  rows?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const semantic = useSemantic();
  const [focused, setFocused] = useState(false);

  return (
    // See Input.tsx: border/background/radius live on a plain RN View rather than on the
    // SwiftUI TextInput's own `style`, since @expo/ui's `modifiers` escape hatch (needed for a
    // properly rounded border) applies innermost, before its own padding — wrapping only the
    // naked field rather than the padded box.
    <View
      style={[
        {
          borderRadius: radius.md,
          borderWidth: 1,
          borderColor: focused ? semantic.borderAccent : semantic.borderDefault,
          backgroundColor: semantic.surfacePage,
        },
        style,
      ]}
    >
      <Host
        matchContents={style ? undefined : { vertical: true }}
        style={style ? { flex: 1, width: "100%" } : { width: "100%" }}
      >
        <TextInput
          defaultValue={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={semantic.textSubtle}
          autoFocus={autoFocus}
          multiline
          numberOfLines={rows}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          cursorColor={semantic.focusRing}
          style={{
            backgroundColor: "transparent",
            paddingHorizontal: spacing[5],
            paddingVertical: spacing[4],
          }}
          textStyle={{
            fontFamily: typography.bodyMD.fontFamily,
            fontSize: typography.bodyMD.fontSize,
            color: semantic.textBody,
          }}
        />
      </Host>
    </View>
  );
}
