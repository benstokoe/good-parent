import { Platform, TextInput, type TextInputProps } from "react-native";

import { cn } from "@/lib/cn";

// React Native Reusables' textarea.tsx, ported as-is — `rows` is our own alias for
// numberOfLines (the app's existing call sites pass rows, not numberOfLines).
export function Textarea({
  rows = 4,
  className,
  ...rest
}: TextInputProps & { rows?: number }) {
  return (
    <TextInput
      multiline
      numberOfLines={rows}
      textAlignVertical="top"
      className={cn(
        "text-foreground border-input flex min-h-16 w-full flex-row rounded-md border bg-transparent px-4 py-3 text-base shadow-sm shadow-black/5",
        Platform.select({
          web: "placeholder:text-muted-foreground outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm",
          native: "placeholder:text-muted-foreground/50",
        }),
        rest.editable === false && "opacity-50",
        className,
      )}
      {...rest}
    />
  );
}
