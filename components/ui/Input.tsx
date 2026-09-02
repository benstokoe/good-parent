import { useState } from "react";
import { TextInput, View, type TextInputProps } from "react-native";

import { semantic } from "@/lib/theme";

export function Input({ style, ...rest }: TextInputProps) {
  const [focus, setFocus] = useState(false);
  return (
    <View
      className="h-9 px-3 rounded-md border justify-center"
      style={{
        backgroundColor: semantic.surfaceCard,
        borderColor: focus ? semantic.borderAccent : semantic.borderDefault,
      }}
    >
      <TextInput
        {...rest}
        onFocus={(e) => {
          setFocus(true);
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocus(false);
          rest.onBlur?.(e);
        }}
        placeholderTextColor={semantic.textSubtle}
        className="font-sans text-body-md"
        style={[{ color: semantic.textBody, padding: 0 }, style]}
      />
    </View>
  );
}
