import { View } from "react-native";

import { useSemantic } from "@/lib/theme-context";

// Desktop-web master-detail layout — a persistent list column beside an adjacent detail
// pane, per DESIGN.md's sidebar+detail-pane rule (web must not just scale up the mobile
// single-column stack). Generic over its list/detail content so any list+detail screen
// (Journal today, Timeline or similar later) can adopt the split without re-deriving it.
export function ListDetailPane({
  list,
  detail,
  listWidth = 380,
}: {
  list: React.ReactNode;
  detail: React.ReactNode;
  listWidth?: number;
}) {
  const semantic = useSemantic();
  return (
    <View className="flex-1 flex-row">
      <View
        className="border-r"
        style={{ width: listWidth, borderColor: semantic.borderSubtle }}
      >
        {list}
      </View>
      <View className="flex-1">{detail}</View>
    </View>
  );
}
