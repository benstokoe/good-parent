import * as TabsPrimitive from "@rn-primitives/tabs";
import { Text } from "react-native";

import { useSemantic } from "@/lib/theme-context";

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
  const semantic = useSemantic();
  return (
    <TabsPrimitive.Root value={value} onValueChange={onChange}>
      <TabsPrimitive.List
        className="flex-row items-center rounded-md p-1 self-stretch"
        style={{ backgroundColor: semantic.surfaceSunken }}
      >
        {items.map((item) => {
          const on = item.value === value;
          return (
            <TabsPrimitive.Trigger
              key={item.value}
              value={item.value}
              className="flex-1 flex-row items-center justify-center gap-1.5 h-[30px] rounded-sm"
              style={{
                backgroundColor: on ? semantic.surfaceCard : "transparent",
                boxShadow: on ? "0px 1px 1px rgba(25,25,24,0.04)" : "none",
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
            </TabsPrimitive.Trigger>
          );
        })}
      </TabsPrimitive.List>
    </TabsPrimitive.Root>
  );
}
