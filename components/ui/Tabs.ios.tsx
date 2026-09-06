import { Host } from "@expo/ui";
import { Picker, Text } from "@expo/ui/swift-ui";
import { pickerStyle, tag } from "@expo/ui/swift-ui/modifiers";

import { colors } from "@/lib/theme";
import { useColorSchemeValue } from "@/lib/theme-context";

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
  const colorScheme = useColorSchemeValue();

  return (
    <Host matchContents colorScheme={colorScheme} seedColor={colors.clay[400]}>
      <Picker
        selection={value}
        onSelectionChange={(next) => next !== null && onChange(String(next))}
        modifiers={[pickerStyle("segmented")]}
      >
        {items.map((item) => (
          <Text key={item.value} modifiers={[tag(item.value)]}>
            {item.count !== undefined ? `${item.label} (${item.count})` : item.label}
          </Text>
        ))}
      </Picker>
    </Host>
  );
}
