import { Platform, TextInput, type TextInputProps } from "react-native";

import { cn } from "@/lib/cn";

// React Native Reusables' input.tsx, ported as-is (packages/registry/src/nativewind/
// components/ui/input.tsx) — no wrapper view or manual focus-tracking; RNR's own input
// doesn't have one either, the border/background come straight from the bg-background/
// border-input tokens in global.css.
export function Input({ className, ...rest }: TextInputProps) {
  return (
    <TextInput
      className={cn(
        "border-input bg-background text-foreground flex h-10 w-full min-w-0 flex-row items-center rounded-md border px-3 py-1 text-base leading-5 shadow-sm shadow-black/5",
        rest.editable === false && "opacity-50",
        Platform.select({
          web: "placeholder:text-muted-foreground outline-none transition-[color,box-shadow] md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          native: "placeholder:text-muted-foreground/50",
        }),
        className,
      )}
      {...rest}
    />
  );
}
