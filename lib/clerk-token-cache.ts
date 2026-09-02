import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import type { TokenCache } from "@clerk/expo";

// expo-secure-store isn't available on web; Clerk's web SDK persists its own session
// there, so on web we just no-op (see ClerkProvider usage in app/_layout.tsx).
export const clerkTokenCache: TokenCache = {
  async getToken(key) {
    if (Platform.OS === "web") return null;
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async saveToken(key, value) {
    if (Platform.OS === "web") return;
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      // ignore — worst case the user is re-prompted to sign in
    }
  },
  async clearToken(key) {
    if (Platform.OS === "web") return;
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {
      // ignore
    }
  },
};
