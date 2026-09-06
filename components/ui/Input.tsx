import { useState, type Ref } from "react";
import { View, type KeyboardTypeOptions, type ReturnKeyTypeOptions, type StyleProp, type ViewStyle } from "react-native";

import { Host, TextInput, type TextInputRef } from "@expo/ui";

import { radius, spacing, typography } from "@/lib/theme";
import { useSemantic } from "@/lib/theme-context";

export type { TextInputRef };

export type InputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  secureTextEntry?: boolean;
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: () => void;
  style?: StyleProp<ViewStyle>;
  ref?: Ref<TextInputRef>;
};

export function Input({
  value,
  onChangeText,
  placeholder,
  autoFocus,
  keyboardType,
  autoCapitalize,
  secureTextEntry,
  returnKeyType,
  onSubmitEditing,
  style,
  ref,
}: InputProps) {
  const semantic = useSemantic();
  const [focused, setFocused] = useState(false);

  return (
    // The border/background/radius live on a plain RN View, not on the SwiftUI TextInput's
    // own `style` — @expo/ui applies a user-supplied `modifiers` escape hatch (needed for a
    // properly rounded border) *innermost*, before its own padding/background modifiers, so
    // a border set that way wraps only the naked field, not the padded box. Keeping decoration
    // on an outer RN View sidesteps that and gets normal, reliable RN border/radius rendering.
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
      <Host matchContents={{ vertical: true }} style={{ width: "100%" }}>
        <TextInput
          ref={ref}
          defaultValue={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={semantic.textSubtle}
          autoFocus={autoFocus}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing ? () => onSubmitEditing() : undefined}
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
