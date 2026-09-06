import { Host, Switch as ExpoSwitch } from "@expo/ui";

import { colors } from "@/lib/theme";
import { useColorSchemeValue } from "@/lib/theme-context";

export function Switch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  const colorScheme = useColorSchemeValue();

  return (
    <Host matchContents colorScheme={colorScheme} seedColor={colors.clay[400]}>
      <ExpoSwitch value={checked} onValueChange={onChange} />
    </Host>
  );
}
