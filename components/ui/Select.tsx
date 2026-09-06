import { Host, Picker } from "@expo/ui";

import { colors } from "@/lib/theme";
import { useColorSchemeValue } from "@/lib/theme-context";

export type SelectOption = { value: string; label: string };

export function Select({
  options,
  value,
  onChange,
}: {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  const colorScheme = useColorSchemeValue();

  return (
    <Host matchContents colorScheme={colorScheme} seedColor={colors.clay[400]}>
      <Picker
        appearance="menu"
        selectedValue={value}
        onValueChange={onChange}
      >
        {options.map((o) => (
          <Picker.Item key={o.value} label={o.label} value={o.value} />
        ))}
      </Picker>
    </Host>
  );
}
