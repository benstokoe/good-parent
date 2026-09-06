import { useEffect, useRef, useState } from "react";
import { Pressable, View } from "react-native";

import { Host, TextInput, type TextInputRef } from "@expo/ui";

import { Icon } from "@/components/ui/icon";
import { radius, spacing, typography } from "@/lib/theme";
import { useSemantic } from "@/lib/theme-context";

// A search-flavored take on Input.tsx: leading search glyph, trailing clear button once
// there's something to clear, and a border that switches to Clay on focus.
export function SearchInput({
  value,
  onChangeText,
  placeholder,
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}) {
  const semantic = useSemantic();
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInputRef>(null);

  const clear = () => {
    onChangeText("");
    inputRef.current?.clear();
  };

  // The underlying native field is uncontrolled (only seeded via `defaultValue`), so a
  // reset from outside this component — e.g. a "clear filters" action — updates `value`
  // without touching what's displayed. Sync the native field whenever the caller drives
  // it back to empty.
  useEffect(() => {
    if (value === "") inputRef.current?.clear();
  }, [value]);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: focused ? semantic.borderAccent : semantic.borderDefault,
        backgroundColor: semantic.surfacePage,
        paddingLeft: spacing[5],
        paddingRight: spacing[3],
      }}
    >
      <Icon name="search" size={18} color={semantic.textSubtle} />
      <Host matchContents={{ vertical: true }} style={{ flex: 1 }}>
        <TextInput
          ref={inputRef}
          defaultValue={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={semantic.textSubtle}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          cursorColor={semantic.focusRing}
          style={{
            backgroundColor: "transparent",
            paddingHorizontal: spacing[4],
            paddingVertical: spacing[4],
          }}
          textStyle={{
            fontFamily: typography.bodyMD.fontFamily,
            fontSize: typography.bodyMD.fontSize,
            color: semantic.textBody,
          }}
        />
      </Host>
      {value.length > 0 ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          onPress={clear}
          hitSlop={8}
        >
          <Icon name="x" size={16} color={semantic.textSubtle} />
        </Pressable>
      ) : null}
    </View>
  );
}
