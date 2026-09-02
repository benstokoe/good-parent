import { useState } from "react";
import { Modal, Pressable, ScrollView, Text } from "react-native";

import { semantic } from "@/lib/theme";
import { Icon } from "@/components/ui/icon";

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
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        className="h-10 px-3 rounded-md border flex-row items-center justify-between"
        style={{ backgroundColor: semantic.surfaceCard, borderColor: semantic.borderDefault }}
      >
        <Text
          className="font-sans text-body-md"
          style={{ color: current ? semantic.textBody : semantic.textSubtle }}
        >
          {current?.label ?? "Select one"}
        </Text>
        <Icon name="chevron-right" size={16} color={semantic.textSubtle} />
      </Pressable>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          className="flex-1 justify-end"
          style={{ backgroundColor: "rgba(25,25,24,0.32)" }}
          onPress={() => setOpen(false)}
        >
          <Pressable
            className="rounded-t-2xl max-h-[60%] pb-8 pt-3"
            style={{ backgroundColor: semantic.surfaceCard }}
          >
            <ScrollView>
              {options.map((o) => (
                <Pressable
                  key={o.value}
                  className="px-6 py-3"
                  onPress={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                >
                  <Text
                    className="font-sans text-body-md"
                    style={{
                      color: o.value === value ? semantic.textAccent : semantic.textBody,
                    }}
                  >
                    {o.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
