import { useState } from "react";
import { Pressable, Text, View, type StyleProp, type TextStyle } from "react-native";

import { typography } from "@/lib/theme";
import { useSemantic } from "@/lib/theme-context";

// Clips to `numberOfLines` via maxHeight (not the numberOfLines prop) so onTextLayout still
// reports the true wrapped line count — the numberOfLines prop would cap that count at the
// same limit, making truncation undetectable.
export function ExpandableText({
  children,
  numberOfLines = 2,
  lineHeight,
  className,
  style,
}: {
  children: string;
  numberOfLines?: number;
  lineHeight: number;
  className?: string;
  style?: StyleProp<TextStyle>;
}) {
  const semantic = useSemantic();
  const [expanded, setExpanded] = useState(false);
  const [truncated, setTruncated] = useState(false);

  return (
    <View>
      <Text
        className={className}
        style={[
          style,
          !expanded && truncated ? { maxHeight: lineHeight * numberOfLines, overflow: "hidden" } : null,
        ]}
        onTextLayout={(e) => {
          if (e.nativeEvent.lines.length > numberOfLines) setTruncated(true);
        }}
      >
        {children}
      </Text>
      {truncated ? (
        <Pressable onPress={() => setExpanded((v) => !v)} hitSlop={8} className="mt-1 self-start">
          <Text style={{ fontFamily: typography.ui.fontFamily, fontSize: 13, color: semantic.textAccent }}>
            {expanded ? "See less" : "See more"}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
