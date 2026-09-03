import { Slot, Tabs, router } from "expo-router";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable, Text, View } from "react-native";

import { LockGate } from "@/components/LockGate";
import { Icon, type IconName } from "@/components/ui/icon";
import { WebShell } from "@/components/web/WebShell";
import { useIsWideWeb } from "@/lib/responsive";
import { semantic } from "@/lib/theme";

const TAB_ICON: Record<string, IconName> = {
  index: "sparkles",
  journal: "pencil",
  growth: "refresh-cw",
  timeline: "eye",
};

const TAB_LABEL: Record<string, string> = {
  index: "Home",
  journal: "Journal",
  growth: "Growth",
  timeline: "Timeline",
};

// Left half of the bar, the raised Panic button, then the right half — matching the
// design's Home / Journal / Panic / Growth / Timeline order without Panic being a real
// route (it opens the /panic modal instead of switching tabs).
const LEFT_TABS = ["index", "journal"];
const RIGHT_TABS = ["growth", "timeline"];

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const byName = Object.fromEntries(state.routes.map((r, i) => [r.name, { route: r, index: i }]));

  const renderTab = (name: string) => {
    const entry = byName[name];
    if (!entry) return null;
    const focused = state.index === entry.index;
    const color = focused ? semantic.textAccent : semantic.textMuted;
    return (
      <Pressable
        key={name}
        className="flex-1 items-center gap-0.5"
        onPress={() => {
          const event = navigation.emit({
            type: "tabPress",
            target: entry.route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) navigation.navigate(entry.route.name);
        }}
      >
        <Icon name={TAB_ICON[name] ?? "sparkles"} size={21} color={color} />
        <Text className="text-[10px]" style={{ color }}>
          {TAB_LABEL[name] ?? name}
        </Text>
      </Pressable>
    );
  };

  return (
    <View
      className="flex-row items-end justify-around px-2 pt-2 pb-7 border-t"
      style={{ backgroundColor: semantic.surfaceCard, borderColor: semantic.borderSubtle }}
    >
      {LEFT_TABS.map(renderTab)}
      <View className="flex-1 items-center gap-0.5">
        <Pressable
          onPress={() => router.push("/panic")}
          className="w-[52px] h-[52px] rounded-full items-center justify-center -mt-4"
          style={{ backgroundColor: semantic.actionPrimary }}
        >
          <Icon name="message-square" size={22} color="#fff" />
        </Pressable>
        <Text className="text-[10px] -mt-2.5" style={{ color: semantic.textMuted }}>
          Panic
        </Text>
      </View>
      {RIGHT_TABS.map(renderTab)}
    </View>
  );
}

export default function TabsLayout() {
  const isWideWeb = useIsWideWeb();

  // Desktop web gets a persistent sidebar + detail-pane shell instead of a bottom tab
  // bar (DESIGN.md Layout / docs/adr/0005); Slot just renders whichever of these routes
  // matched, with the Sidebar driving navigation between them via the URL.
  if (isWideWeb) {
    return (
      <LockGate>
        <WebShell>
          <Slot />
        </WebShell>
      </LockGate>
    );
  }

  return (
    <LockGate>
      <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <CustomTabBar {...props} />}>
        <Tabs.Screen name="index" />
        <Tabs.Screen name="journal" />
        <Tabs.Screen name="growth" />
        <Tabs.Screen name="timeline" />
      </Tabs>
    </LockGate>
  );
}
