import * as TabsPrimitive from "@rn-primitives/tabs";
import { Platform, Text } from "react-native";

import { cn } from "@/lib/cn";

export type TabItem = { value: string; label: string; count?: number };

// React Native Reusables' tabs.tsx classNames (bg-muted list, bg-background active
// trigger), kept behind the app's existing declarative items/value/onChange API rather
// than requiring every call site to lay out TabsList/TabsTrigger/TabsContent by hand.
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
    <TabsPrimitive.Root value={value} onValueChange={onChange}>
      <TabsPrimitive.List className="bg-muted flex h-9 flex-row items-center justify-center rounded-lg p-[3px]">
        {items.map((item) => {
          const on = item.value === value;
          return (
            <TabsPrimitive.Trigger
              key={item.value}
              value={item.value}
              className={cn(
                "flex h-[calc(100%-1px)] flex-1 flex-row items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 shadow-none",
                Platform.select({
                  web: "focus-visible:border-ring focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] focus-visible:ring-[3px]",
                }),
                on && "bg-background shadow-sm shadow-black/5",
              )}
            >
              <Text className={cn("text-sm font-medium", on ? "text-foreground" : "text-muted-foreground")}>
                {item.label}
              </Text>
              {item.count !== undefined ? (
                <Text className="text-muted-foreground text-xs">{item.count}</Text>
              ) : null}
            </TabsPrimitive.Trigger>
          );
        })}
      </TabsPrimitive.List>
    </TabsPrimitive.Root>
  );
}
