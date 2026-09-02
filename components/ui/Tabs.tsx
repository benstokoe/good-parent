import { Pressable, Text, View } from "react-native";

import { semantic } from "@/lib/theme";

export type TabItem = { value: string; label: string; count?: number };

export function Tabs({
  items,
  value,
  onChange,
}: {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <View
      className="flex-row items-center rounded-md p-1 self-stretch"
      style={{ backgroundColor: semantic.surfaceSunken }}
    >
      {items.map((item) => {
        const on = item.value === value;
        return (
          <Pressable
            key={item.value}
            onPress={() => onChange(item.value)}
            className="flex-1 flex-row items-center justify-center gap-1.5 h-[30px] rounded-sm"
            style={{
              backgroundColor: on ? semantic.surfaceCard : "transparent",
              shadowColor: "#191918",
              shadowOpacity: on ? 0.04 : 0,
              shadowRadius: 1,
              shadowOffset: { width: 0, height: 1 },
            }}
          >
            <Text
              className={on ? "font-sans-medium text-body-sm" : "font-sans text-body-sm"}
              style={{ color: on ? semantic.textHeading : semantic.textMuted }}
            >
              {item.label}
            </Text>
            {item.count !== undefined ? (
              <Text className="text-caption" style={{ color: semantic.textSubtle }}>
                {item.count}
              </Text>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}
