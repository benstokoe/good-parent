import { Host } from "@expo/ui";
import { SegmentedButton, SingleChoiceSegmentedButtonRow, Text } from "@expo/ui/jetpack-compose";
import { fillMaxWidth } from "@expo/ui/jetpack-compose/modifiers";

import { colors } from "@/lib/theme";

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
    <Host matchContents seedColor={colors.clay[400]}>
      <SingleChoiceSegmentedButtonRow modifiers={[fillMaxWidth()]}>
        {items.map((item) => (
          <SegmentedButton
            key={item.value}
            selected={item.value === value}
            onClick={() => onChange(item.value)}
          >
            <SegmentedButton.Label>
              <Text>{item.count !== undefined ? `${item.label} (${item.count})` : item.label}</Text>
            </SegmentedButton.Label>
          </SegmentedButton>
        ))}
      </SingleChoiceSegmentedButtonRow>
    </Host>
  );
}
