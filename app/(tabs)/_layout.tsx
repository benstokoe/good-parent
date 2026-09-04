import { Slot, Tabs, router, usePathname } from "expo-router";
import type { BottomTabBarProps } from "expo-router/build/react-navigation/bottom-tabs";
import { GlassContainer, GlassView, isGlassEffectAPIAvailable } from "expo-glass-effect";
import { Platform, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LockGate } from "@/components/LockGate";
import { Icon, type IconName } from "@/components/ui/icon";
import { WebShell } from "@/components/web/WebShell";
import { useIsWideWeb } from "@/lib/responsive";
import { colors } from "@/lib/theme";
import { useSemantic } from "@/lib/theme-context";

// iOS 26+ only — some iOS 26 betas shipped without the Liquid Glass API despite
// otherwise matching, so this is checked at runtime rather than assumed from the OS
// version alone (see https://github.com/expo/expo/issues/40911). Everywhere else
// (older iOS, Android, web) falls back to the original solid bar below.
const supportsGlass = Platform.OS === "ios" && isGlassEffectAPIAvailable();

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

// Docked, opaque fallback bar — normal flex layout, reserves its own row. Used on
// every platform without Liquid Glass (Android, older iOS, web).
function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const semantic = useSemantic();
  // FloatingGlassBar (rendered as a sibling of <Tabs>, not through this prop) owns
  // the glass case entirely — returning null here (rather than relying solely on
  // tabBarStyle: { display: "none" }) is what actually stops this component from
  // rendering; display:none alone only strips its layout constraints, letting it
  // float unconstrained on top of the glass bar instead of disappearing.
  if (supportsGlass) return null;

  const byName = Object.fromEntries(state.routes.map((r, i) => [r.name, { route: r, index: i }]));

  const renderTab = (name: string) => {
    const entry = byName[name];
    if (!entry) return null;
    const focused = state.index === entry.index;
    const color = focused ? semantic.textAccent : semantic.textMuted;
    return (
      <Pressable
        key={name}
        className="flex-1 items-center gap-1.5"
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
      className="flex-row items-end justify-around px-1 pt-1 pb-5 border-t"
      style={{ backgroundColor: semantic.surfaceCard, borderColor: semantic.borderSubtle }}
    >
      {LEFT_TABS.map(renderTab)}
      <View className="flex-1 items-center gap-1.5">
        <Pressable
          onPress={() => router.push("/panic")}
          className="w-[52px] h-[52px] rounded-full items-center justify-center -mt-2"
          style={{ backgroundColor: semantic.actionPrimary }}
        >
          <Icon name="message-square" size={22} color="#fff" />
        </Pressable>
        <Text className="text-[10px] -mt-1.5" style={{ color: semantic.textMuted }}>
          Panic
        </Text>
      </View>
      {RIGHT_TABS.map(renderTab)}
    </View>
  );
}

// Floating glass capsule — rendered as a sibling *outside* the Tabs navigator (not via
// its `tabBar` prop), absolutely positioned over scene content. The navigator's own
// tab-bar slot is hidden entirely (`tabBarStyle: { display: "none" }`) rather than
// styled transparent, because that slot's reserved-space background is painted by
// BottomTabView itself and isn't reachable through a custom tabBar's own styling —
// hiding it is what lets scene content (and its page background) extend under this.
function FloatingGlassBar() {
  const semantic = useSemantic();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const isActive = (name: string) => (name === "index" ? pathname === "/" : pathname === `/${name}`);
  const go = (name: string) => router.navigate(name === "index" ? "/" : (`/${name}` as never));

  const renderTab = (name: string) => {
    const focused = isActive(name);
    const color = focused ? semantic.textAccent : semantic.textMuted;
    return (
      <Pressable key={name} className="flex-1 items-center gap-1.5" onPress={() => go(name)}>
        <Icon name={TAB_ICON[name] ?? "sparkles"} size={21} color={color} />
        <Text className="text-[10px]" style={{ color }}>
          {TAB_LABEL[name] ?? name}
        </Text>
      </Pressable>
    );
  };

  return (
    <View
      pointerEvents="box-none"
      style={{ position: "absolute", left: 0, right: 0, bottom: 0, paddingHorizontal: 16 }}
    >
      <View style={{ paddingBottom: insets.bottom + 8 }}>
        {/* Floating capsule, detached from the screen edges — the panic button is a
            second glass shape overlapping the bar's top edge; GlassContainer's `spacing`
            is what makes Liquid Glass visually merge the two where they're close together,
            instead of just stacking two independently-blurred shapes. */}
        <GlassContainer spacing={24} style={{ height: 68 }}>
          <GlassView
            glassEffectStyle="regular"
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 999,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              paddingHorizontal: 8,
            }}
          >
            {LEFT_TABS.map(renderTab)}
            <View className="flex-1 items-center gap-1.5">
              <View style={{ width: 21, height: 21 }} />
              <Text className="text-[10px]" style={{ color: semantic.textMuted }}>
                Panic
              </Text>
            </View>
            {RIGHT_TABS.map(renderTab)}
          </GlassView>
          <GlassView
            glassEffectStyle="clear"
            tintColor={colors.clay[100]}
            isInteractive
            style={{
              position: "absolute",
              top: -14,
              alignSelf: "center",
              width: 52,
              height: 52,
              borderRadius: 999,
            }}
          >
            <Pressable
              onPress={() => router.push("/panic")}
              className="w-[52px] h-[52px] rounded-full items-center justify-center"
            >
              <Icon name="message-square" size={22} color={semantic.actionPrimary} />
            </Pressable>
          </GlassView>
        </GlassContainer>
      </View>
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
      <View style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            headerShown: false,
            // Collapses the navigator's own tab-bar slot to nothing rather than styling
            // it transparent — that slot's reserved-space background is painted by
            // BottomTabView itself and isn't reachable through a custom tabBar's own
            // styling, which is why scene content wasn't extending underneath it before.
            tabBarStyle: supportsGlass ? { display: "none" } : undefined,
          }}
          tabBar={(props) => <CustomTabBar {...props} />}
        >
          <Tabs.Screen name="index" />
          <Tabs.Screen name="journal" />
          <Tabs.Screen name="growth" />
          <Tabs.Screen name="timeline" />
        </Tabs>
        {supportsGlass ? <FloatingGlassBar /> : null}
      </View>
    </LockGate>
  );
}
