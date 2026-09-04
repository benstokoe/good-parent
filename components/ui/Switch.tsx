import * as SwitchPrimitive from "@rn-primitives/switch";
import { Platform } from "react-native";

import { cn } from "@/lib/cn";

// React Native Reusables' switch.tsx, ported as-is.
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
      className={cn(
        "flex h-[1.15rem] w-8 shrink-0 flex-row items-center rounded-full border border-transparent shadow-sm shadow-black/5",
        Platform.select({
          web: "focus-visible:border-ring focus-visible:ring-ring/50 peer inline-flex outline-none transition-all focus-visible:ring-[3px]",
        }),
        checked ? "bg-primary" : "bg-input",
      )}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "bg-background size-4 rounded-full transition-transform",
          Platform.select({ web: "pointer-events-none block ring-0" }),
          checked ? "translate-x-3.5" : "translate-x-0",
        )}
      />
    </SwitchPrimitive.Root>
  );
}
