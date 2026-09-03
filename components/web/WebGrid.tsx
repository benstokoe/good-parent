import { Children } from "react";
import { View } from "react-native";

import { useIsWideWeb } from "@/lib/responsive";

// Lays card lists out as a wrapping multi-column grid on the wide-web shell instead of
// the mobile single vertical stack. `calc()` only ever reaches react-native-web's style
// output, since this only renders its grid branch when useIsWideWeb() is true.
export function WebGrid({
  children,
  columns = 2,
  gap = 12,
}: {
  children: React.ReactNode;
  columns?: number;
  gap?: number;
}) {
  const isWideWeb = useIsWideWeb();
  const items = Children.toArray(children);

  if (!isWideWeb) return <View style={{ gap }}>{items}</View>;

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap }}>
      {items.map((child, i) => (
        <View key={i} style={{ width: `calc(${100 / columns}% - ${(gap * (columns - 1)) / columns}px)` as any }}>
          {child}
        </View>
      ))}
    </View>
  );
}
