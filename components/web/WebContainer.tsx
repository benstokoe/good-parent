import { View, type ViewProps } from "react-native";

import { useIsWideWeb } from "@/lib/responsive";

// Centers screen content at a readable desktop measure instead of letting the mobile
// single-column stack stretch edge-to-edge in a browser window. No-op on native and on
// narrow/mobile web, where the existing single-column layout is already correct.
export function WebContainer({
  maxWidth = 720,
  children,
  style,
  ...rest
}: ViewProps & { maxWidth?: number }) {
  const isWideWeb = useIsWideWeb();
  if (!isWideWeb) return <>{children}</>;

  return (
    <View {...rest} style={[{ width: "100%", maxWidth, alignSelf: "center" }, style]}>
      {children}
    </View>
  );
}
