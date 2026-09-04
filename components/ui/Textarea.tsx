import { useState } from "react";
import { TextInput, type TextInputProps } from "react-native";

import { useSemantic } from "@/lib/theme-context";

export function Textarea({
  rows = 4,
  style,
  ...rest
}: TextInputProps & { rows?: number }) {
  const semantic = useSemantic();
  const [focus, setFocus] = useState(false);
  return (
    <TextInput
      {...rest}
      multiline
      numberOfLines={rows}
      textAlignVertical="top"
      onFocus={(e) => {
        setFocus(true);
        rest.onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocus(false);
        rest.onBlur?.(e);
      }}
      placeholderTextColor={semantic.textSubtle}
      className="font-sans text-body-md rounded-md border px-3 py-3"
      style={[
        {
          backgroundColor: semantic.surfaceCard,
          borderColor: focus ? semantic.borderAccent : semantic.borderDefault,
          color: semantic.textBody,
          minHeight: rows * 22,
        },
        style,
      ]}
    />
  );
}
