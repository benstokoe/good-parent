import { Switch as RNSwitch } from "react-native";

import { colors } from "@/lib/theme";

export function Switch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <RNSwitch
      value={checked}
      onValueChange={onChange}
      trackColor={{ false: colors.warm[300], true: colors.clay[400] }}
      thumbColor="#FFFFFF"
    />
  );
}
