import { View } from "react-native";

import { Sidebar } from "@/components/web/Sidebar";
import { useSemantic } from "@/lib/theme-context";

export function WebShell({ children }: { children: React.ReactNode }) {
  const semantic = useSemantic();
  return (
    <View className="flex-1 flex-row" style={{ backgroundColor: semantic.surfacePage }}>
      <Sidebar />
      <View className="flex-1">{children}</View>
    </View>
  );
}
