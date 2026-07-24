"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/icon-button";
import { MicIcon } from "@/components/ui/icons";

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export function VoiceInputButton({ onTranscript, className }: VoiceInputButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const onTranscriptRef = useRef(onTranscript);
  onTranscriptRef.current = onTranscript;

  useEffect(() => {
    const SpeechRecognitionCtor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) return;

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      onTranscriptRef.current(transcript);
    };

    recognition.onend = () => setIsRecording(false);
    recognition.onerror = () => setIsRecording(false);

    recognitionRef.current = recognition;
    setIsSupported(true);

    return () => {
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;
      recognition.stop();
    };
  }, []);

  function toggleRecording() {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
    }
  }

  return (
    <IconButton
      type="button"
      label={
        !isSupported
          ? "Voice input not supported in this browser"
          : isRecording
            ? "Stop voice input"
            : "Start voice input"
      }
      onClick={toggleRecording}
      disabled={!isSupported}
      className={cn("cursor-pointer disabled:cursor-not-allowed disabled:opacity-40", className)}
    >
      <MicIcon className="h-4 w-4" />
    </IconButton>
  );
}
