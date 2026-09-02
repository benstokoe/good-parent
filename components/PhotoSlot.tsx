import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Image, Pressable, Text } from "react-native";

import { semantic } from "@/lib/theme";

// A minimal stand-in for the design's <image-slot> placeholder — lets a Journal entry
// carry a photo picked from the device library. Not persisted (no Convex storage wiring
// yet, see the implementation report); state is local to this component instance.
export function PhotoSlot() {
  const [uri, setUri] = useState<string | null>(null);

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
      <Pressable onPress={pick}>
        <Image source={{ uri }} className="w-full h-[120px] rounded-[10px]" resizeMode="cover" />
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={pick}
      className="w-full h-[120px] rounded-[10px] items-center justify-center border border-dashed"
      style={{ borderColor: semantic.borderDefault, backgroundColor: semantic.surfaceSunken }}
    >
      <Text className="font-sans text-body-sm" style={{ color: semantic.textSubtle }}>
        Add a photo
      </Text>
    </Pressable>
  );
}
