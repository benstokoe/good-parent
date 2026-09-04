import * as SwitchPrimitive from "@rn-primitives/switch";

import { colors } from "@/lib/theme";

export function Switch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <SwitchPrimitive.Root
      checked={checked}
      onCheckedChange={onChange}
      className="w-[52px] h-[31px] rounded-full justify-center px-[2px]"
      style={{ backgroundColor: checked ? colors.clay[400] : colors.warm[300] }}
    >
      <SwitchPrimitive.Thumb
        className="w-[27px] h-[27px] rounded-full bg-white"
        style={{
          boxShadow: "0px 1px 2px rgba(25,25,24,0.15)",
          transform: [{ translateX: checked ? 20 : 0 }],
        }}
      />
    </SwitchPrimitive.Root>
  );
}
