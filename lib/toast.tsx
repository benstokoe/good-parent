import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useSemantic } from "@/lib/theme-context";

// A minimal, app-wide toast for brief, warm confirmations (e.g. "Entry saved.") — not an
// error/alert channel, just the quiet acknowledgment GoodParent's affirming voice calls for
// after a moment like saving a Journal entry. Auto-dismisses; never blocks interaction.
const DISMISS_AFTER_MS = 2600;

type ToastContextValue = { showToast: (message: string) => void };
const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const semantic = useSemantic();
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((next: string) => {
    if (timer.current) clearTimeout(timer.current);
    setMessage(next);
    timer.current = setTimeout(() => setMessage(null), DISMISS_AFTER_MS);
  }, []);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message ? (
        <View
          pointerEvents="none"
          className="absolute left-0 right-0 items-center px-6"
          style={{ bottom: insets.bottom + 96 }}
        >
          <Animated.View
            entering={FadeIn.duration(150)}
            exiting={FadeOut.duration(200)}
            className="rounded-full px-4 py-2.5 shadow-sm shadow-black/10"
            style={{ backgroundColor: semantic.textHeading }}
          >
            <Text className="font-sans-medium text-body-sm" style={{ color: semantic.surfacePage }}>
              {message}
            </Text>
          </Animated.View>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
}
