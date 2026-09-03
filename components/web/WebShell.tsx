import { View } from "react-native";

import { Sidebar } from "@/components/web/Sidebar";
import { semantic } from "@/lib/theme";

export function WebShell({ children }: { children: React.ReactNode }) {
  return (
    <View className="flex-1 flex-row" style={{ backgroundColor: semantic.surfacePage }}>
      <Sidebar />
      <View className="flex-1">{children}</View>
    </View>
  );
}
