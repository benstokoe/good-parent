import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

import { Icon } from "@/components/ui/icon";
import { useSemantic } from "@/lib/theme-context";

const MAX_PHOTOS = 6;

// A minimal stand-in for the design's <image-slot> placeholder — lets a Journal entry
// carry a photo picked from the device library. Uncontrolled (no props) for the decorative
// slot on existing entry cards; pass uri + onChange to make it a controlled field, as the
// journal-entry compose screen does.
export function PhotoSlot({
  uri: controlledUri,
  onChange,
  height = 120,
}: {
  uri?: string | null;
  onChange?: (uri: string | null) => void;
  height?: number;
} = {}) {
  const semantic = useSemantic();
  const [internalUri, setInternalUri] = useState<string | null>(null);
  const isControlled = onChange !== undefined;
  const uri = isControlled ? (controlledUri ?? null) : internalUri;
  const setUri = isControlled ? onChange : setInternalUri;

  const pick = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) setUri(result.assets[0].uri);
  };

  if (uri) {
    return (
      <View className="relative">
        <Pressable onPress={pick}>
          <Image
            source={{ uri }}
            style={{ height }}
            className="w-full rounded-[10px]"
            resizeMode="cover"
          />
        </Pressable>
        {isControlled ? (
          <Pressable
            onPress={() => setUri(null)}
            accessibilityLabel="Remove photo"
            accessibilityRole="button"
            className="absolute top-2 right-2 w-9 h-9 rounded-full items-center justify-center bg-black/50"
          >
            <Icon name="x" size={16} color="#fff" />
          </Pressable>
        ) : null}
      </View>
    );
  }

  return (
    <Pressable
      onPress={pick}
      className="w-full rounded-[10px] items-center justify-center border border-dashed gap-1"
      style={{ height, borderColor: semantic.borderDefault, backgroundColor: semantic.surfaceSunken }}
    >
      <Icon name="image-plus" size={18} color={semantic.textSubtle} />
      <Text className="font-sans text-body-sm" style={{ color: semantic.textSubtle }}>
        Add a photo
      </Text>
    </Pressable>
  );
}

// A controlled multi-image field for the Journal compose screen — same visual language
// as PhotoSlot's empty/dashed tile, but keeps a whole array and lets each thumbnail be
// removed individually. ImagePicker's multi-select result already respects the space
// left under MAX_PHOTOS, so no per-tile truncation is needed after a pick.
export function PhotoGrid({
  uris,
  onChange,
  tileSize = 96,
}: {
  uris: string[];
  onChange: (uris: string[]) => void;
  tileSize?: number;
}) {
  const semantic = useSemantic();
  const remaining = MAX_PHOTOS - uris.length;

  const pick = async () => {
    if (remaining <= 0) return;
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.7,
      allowsMultipleSelection: true,
      selectionLimit: remaining,
    });
    if (result.canceled) return;
    const picked = result.assets.map((a) => a.uri);
    onChange([...uris, ...picked].slice(0, MAX_PHOTOS));
  };

  const removeAt = (index: number) => {
    onChange(uris.filter((_, i) => i !== index));
  };

  return (
    <View className="flex-row flex-wrap gap-2">
      {uris.map((uri, index) => (
        <View key={uri + index} style={{ width: tileSize, height: tileSize }} className="relative">
          <Image
            source={{ uri }}
            style={{ width: tileSize, height: tileSize }}
            className="rounded-[10px]"
            resizeMode="cover"
          />
          <Pressable
            onPress={() => removeAt(index)}
            accessibilityLabel="Remove photo"
            accessibilityRole="button"
            className="absolute top-1 right-1 w-6 h-6 rounded-full items-center justify-center bg-black/50"
          >
            <Icon name="x" size={12} color="#fff" />
          </Pressable>
        </View>
      ))}

      {remaining > 0 ? (
        <Pressable
          onPress={pick}
          accessibilityLabel="Add photos"
          accessibilityRole="button"
          className="rounded-[10px] items-center justify-center border border-dashed gap-1"
          style={{
            width: tileSize,
            height: tileSize,
            borderColor: semantic.borderDefault,
            backgroundColor: semantic.surfaceSunken,
          }}
        >
          <Icon name="image-plus" size={16} color={semantic.textSubtle} />
          <Text className="font-sans text-caption" style={{ color: semantic.textSubtle }}>
            {uris.length === 0 ? "Add photos" : "Add more"}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
