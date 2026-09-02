import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export function BreathingOrb({
  size = 120,
  colors,
  durationMs = 6000,
}: {
  size?: number;
  colors: [string, string];
  durationMs?: number;
}) {
  const scale = useSharedValue(0.72);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.16, { duration: durationMs / 2, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [durationMs, scale]);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={[{ width: size, height: size, borderRadius: size / 2 }, style]}>
      <LinearGradient
        colors={colors}
        style={{ flex: 1, borderRadius: size / 2 }}
        start={{ x: 0.3, y: 0.3 }}
        end={{ x: 0.9, y: 0.9 }}
      />
    </Animated.View>
  );
}
