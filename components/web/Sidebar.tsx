import { router, usePathname } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { Icon, type IconName } from "@/components/ui/icon";
import { useSemantic } from "@/lib/theme-context";

type NavItem = { href: "/(tabs)" | "/journal" | "/growth" | "/timeline"; pathname: string; icon: IconName; label: string };

const NAV_ITEMS: NavItem[] = [
  { href: "/(tabs)", pathname: "/", icon: "sparkles", label: "Home" },
  { href: "/journal", pathname: "/journal", icon: "pencil", label: "Journal" },
  { href: "/growth", pathname: "/growth", icon: "refresh-cw", label: "Growth Space" },
  { href: "/timeline", pathname: "/timeline", icon: "eye", label: "Timeline" },
];

// Persistent left rail replacing the mobile bottom tab bar on the wide-web shell
// (DESIGN.md Layout / docs/adr/0005) — same nav set, same tokens, desktop topology.
export function Sidebar() {
  const semantic = useSemantic();
  const pathname = usePathname();

  return (
    <View
      className="w-[240px] shrink-0 border-r px-2 py-4"
      style={{ backgroundColor: semantic.surfaceCard, borderColor: semantic.borderSubtle }}
    >
      <Pressable onPress={() => router.push("/(tabs)")} className="px-1 mb-6">
        <Text className="font-display text-title-sm" style={{ color: semantic.textHeading }}>
          GoodParent
        </Text>
      </Pressable>

      <View className="gap-0.5">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.pathname;
          return (
            <Pressable
              key={item.href}
              onPress={() => router.push(item.href)}
              className="flex-row items-center gap-1.5 rounded-md px-1.5 py-2.5"
              style={{ backgroundColor: active ? semantic.surfaceAccent : "transparent" }}
            >
              <Icon
                name={item.icon}
                size={17}
                color={active ? semantic.textAccent : semantic.textMuted}
              />
              <Text
                className={active ? "font-sans-semibold text-body-sm" : "font-sans text-body-sm"}
                style={{ color: active ? semantic.textAccent : semantic.textBody }}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        onPress={() => router.push("/panic")}
        className="flex-row items-center gap-1.5 rounded-md px-1.5 py-2.5 mt-2"
        style={{ backgroundColor: semantic.actionPrimary }}
      >
        <Icon name="message-square" size={17} color="#fff" />
        <Text className="font-sans-semibold text-body-sm" style={{ color: "#fff" }}>
          Panic Button
        </Text>
      </Pressable>

      <View className="flex-1" />

      <Pressable
        onPress={() => router.push("/account")}
        className="flex-row items-center gap-1.5 rounded-md px-1.5 py-2.5"
      >
        <Icon name="user" size={17} color={semantic.textMuted} />
        <Text className="font-sans text-body-sm" style={{ color: semantic.textBody }}>
          Account
        </Text>
      </Pressable>
    </View>
  );
}
