import { useRef, useState } from "react";
import { Platform } from "react-native";

type SpeechRecognitionModule = typeof import("expo-speech-recognition");

let speechRecognition: SpeechRecognitionModule | null = null;
try {
  speechRecognition = require("expo-speech-recognition");
} catch {
  // Native module not present (e.g. Expo Go) — voice recognition is unavailable.
}
const useSpeechRecognitionEvent = speechRecognition?.useSpeechRecognitionEvent ?? (() => {});

type UseVoiceRecognitionOptions<Field extends string> = {
  onTranscript: (field: Field, transcript: string) => void;
};

/** Toggle-to-record voice input, keyed by an arbitrary field name (e.g. which text input is active). */
export function useVoiceRecognition<Field extends string>({
  onTranscript,
}: UseVoiceRecognitionOptions<Field>) {
  const [recordingField, setRecordingField] = useState<Field | null>(null);
  const baseTextRef = useRef("");

  useSpeechRecognitionEvent("result", (event) => {
    if (!recordingField) return;
    const transcript = event.results[0]?.transcript ?? "";
    onTranscript(
      recordingField,
      baseTextRef.current ? `${baseTextRef.current} ${transcript}` : transcript,
    );
  });

  useSpeechRecognitionEvent("end", () => setRecordingField(null));
  useSpeechRecognitionEvent("error", () => setRecordingField(null));

  const toggleRecording = async (field: Field, currentText: string) => {
    const module = speechRecognition?.ExpoSpeechRecognitionModule;
    if (!module) return;
    if (recordingField === field) {
      module.stop();
      return;
    }
    if (recordingField) {
      module.stop();
    }
    if (Platform.OS !== "web") {
      const { granted } = await module.requestPermissionsAsync();
      if (!granted) return;
    }
    baseTextRef.current = currentText;
    setRecordingField(field);
    module.start({
      lang: "en-US",
      interimResults: true,
      continuous: true,
    });
  };

  return {
    isAvailable: speechRecognition !== null,
    recordingField,
    toggleRecording,
  };
}
